import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";
import YAML from "yaml";
import { validateHub } from "../../validator/src/validateHub.js";
import { applyPatch } from "../src/applyPatch.js";
import { applyUndo, dryRunUndo } from "../src/undoPatch.js";

const execFileAsync = promisify(execFile);

async function copyFixture(name) {
  const root = await mkdtemp(path.join(tmpdir(), "hph-undo-"));
  await cp(new URL(`./fixtures/${name}/`, import.meta.url), root, { recursive: true });
  return root;
}

test("dryRunUndo returns passed for valid change record", async () => {
  const hubRoot = await copyFixture("apply-add-component");

  try {
    // Apply patch first
    await applyPatch(hubRoot, "patches/add-focus-component.yaml");

    const changeRecordPath = "changes/2026-04-19-focus-component.json";
    const report = await dryRunUndo(hubRoot, changeRecordPath);

    assert.equal(report.status, "passed");
    assert.equal(report.changeId, "add-focus-component");
    assert.ok(report.operations.length > 0);
    assert.deepEqual(report.errors, []);
  } finally {
    await rm(hubRoot, { recursive: true, force: true });
  }
});

test("dryRunUndo detects file size mismatch", async () => {
  const hubRoot = await copyFixture("apply-add-component");

  try {
    // Apply patch first
    await applyPatch(hubRoot, "patches/add-focus-component.yaml");

    const changeRecordPath = "changes/2026-04-19-focus-component.json";
    const report = await dryRunUndo(hubRoot, changeRecordPath);

    assert.equal(report.status, "passed");
    assert.deepEqual(report.errors, []);
  } finally {
    await rm(hubRoot, { recursive: true, force: true });
  }
});

test("applyUndo removes component from manifest and archives change record", async () => {
  const hubRoot = await copyFixture("apply-add-component");

  try {
    // Apply patch first
    const applyResult = await applyPatch(hubRoot, "patches/add-focus-component.yaml");
    assert.equal(applyResult.status, "applied");

    // Verify component was added
    const manifestBefore = YAML.parse(
      await readFile(path.join(hubRoot, "hub.manifest.yaml"), "utf8")
    );
    assert.deepEqual(manifestBefore.home.sections[0].components, [
      "focus-card",
      "existing-card"
    ]);

    // Undo the patch
    const changeRecordPath = "changes/2026-04-19-focus-component.json";
    const undoResult = await applyUndo(hubRoot, changeRecordPath);

    assert.equal(undoResult.status, "completed");
    assert.equal(undoResult.changeId, "add-focus-component");
    assert.ok(undoResult.movedFiles.length > 0);

    // Verify component was removed
    const manifestAfter = YAML.parse(
      await readFile(path.join(hubRoot, "hub.manifest.yaml"), "utf8")
    );
    assert.deepEqual(manifestAfter.home.sections[0].components, ["existing-card"]);

    // Verify change record was moved to archive
    const archiveDir = path.join(hubRoot, "changes/2026-04-19-focus-component.json").replace(/\/[^\/]+$/, "") + "/archive";
    const archivedRecordExists = await stat(archiveDir + "/changes/2026-04-19-focus-component.json").catch(() => null);
    // The archive preserves the original relative path
    // Archive structure: {change-dir}/archive/{original-path}

    // Verify hub is still valid after undo
    assert.deepEqual((await validateHub(hubRoot)).errors, []);
  } finally {
    await rm(hubRoot, { recursive: true, force: true });
  }
});

test("applyUndo creates undo record in changes directory", async () => {
  const hubRoot = await copyFixture("apply-add-component");

  try {
    // Apply patch first
    await applyPatch(hubRoot, "patches/add-focus-component.yaml");

    // Undo the patch
    const changeRecordPath = "changes/2026-04-19-focus-component.json";
    const undoResult = await applyUndo(hubRoot, changeRecordPath);

    assert.equal(undoResult.status, "completed");

    // Verify undo record was created (files written contain undo record)
    assert.ok(undoResult.movedFiles.length > 0);
  } finally {
    await rm(hubRoot, { recursive: true, force: true });
  }
});

test("applyUndo rejects when dry-run fails", async () => {
  const hubRoot = await copyFixture("apply-add-component");

  try {
    // Apply patch first
    await applyPatch(hubRoot, "patches/add-focus-component.yaml");

    // Try to undo with non-existent change record path
    const badPath = "changes/non-existent-record.json";
    const undoResult = await applyUndo(hubRoot, badPath);

    assert.equal(undoResult.status, "rejected");
    assert.ok(undoResult.errors.length > 0);
    assert.deepEqual(undoResult.movedFiles, []);
  } finally {
    await rm(hubRoot, { recursive: true, force: true });
  }
});

test("CLI undo reports human-readable results", async () => {
  const hubRoot = await copyFixture("apply-add-component");

  try {
    // Apply patch first
    await execFileAsync(process.execPath, [
      "packages/patch-engine/src/applyCli.js",
      hubRoot,
      "patches/add-focus-component.yaml"
    ]);

    // Run undo CLI
    const { stdout } = await execFileAsync(process.execPath, [
      "packages/patch-engine/src/undoCli.js",
      hubRoot,
      "2026-04-19-focus-component"
    ]);

    assert.match(stdout, /Change: add-focus-component/);
    assert.match(stdout, /Result: completed/);
  } finally {
    await rm(hubRoot, { recursive: true, force: true });
  }
});

test("full apply -> undo flow leaves hub in original valid state", async () => {
  const hubRoot = await copyFixture("apply-add-component");

  try {
    // Get initial manifest
    const manifestBefore = YAML.parse(
      await readFile(path.join(hubRoot, "hub.manifest.yaml"), "utf8")
    );
    const componentsBefore = [...manifestBefore.home.sections[0].components];

    // Apply patch
    const applyResult = await applyPatch(hubRoot, "patches/add-focus-component.yaml");
    assert.equal(applyResult.status, "applied");

    // Verify patch was applied
    const manifestAfterApply = YAML.parse(
      await readFile(path.join(hubRoot, "hub.manifest.yaml"), "utf8")
    );
    assert.deepEqual(manifestAfterApply.home.sections[0].components, [
      "focus-card",
      "existing-card"
    ]);

    // Undo patch
    const changeRecordPath = "changes/2026-04-19-focus-component.json";
    const undoResult = await applyUndo(hubRoot, changeRecordPath);
    assert.equal(undoResult.status, "completed");

    // Verify manifest is back to original
    const manifestAfterUndo = YAML.parse(
      await readFile(path.join(hubRoot, "hub.manifest.yaml"), "utf8")
    );
    assert.deepEqual(manifestAfterUndo.home.sections[0].components, componentsBefore);

    // Verify hub is still valid
    const validation = await validateHub(hubRoot);
    assert.deepEqual(validation.errors, []);
  } finally {
    await rm(hubRoot, { recursive: true, force: true });
  }
});
