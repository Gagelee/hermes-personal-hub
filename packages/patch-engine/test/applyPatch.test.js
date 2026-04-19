import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";
import YAML from "yaml";
import { validateHub } from "../../validator/src/validateHub.js";
import { applyPatch } from "../src/applyPatch.js";

const execFileAsync = promisify(execFile);

async function copyFixture(name) {
  const root = await mkdtemp(path.join(tmpdir(), "hph-apply-"));
  await cp(new URL(`./fixtures/${name}/`, import.meta.url), root, { recursive: true });
  return root;
}

test("applies a low-risk dry-run-passing patch to a Hub tree", async () => {
  const hubRoot = await copyFixture("apply-add-component");

  try {
    const result = await applyPatch(hubRoot, "patches/add-focus-component.yaml");

    assert.equal(result.status, "applied");
    assert.deepEqual(result.writtenFiles.sort(), [
      "changes/2026-04-19-focus-component.json",
      "hub.manifest.yaml"
    ]);

    const manifest = YAML.parse(await readFile(path.join(hubRoot, "hub.manifest.yaml"), "utf8"));
    assert.deepEqual(manifest.home.sections[0].components, [
      "focus-card",
      "existing-card"
    ]);

    const changeRecord = JSON.parse(
      await readFile(path.join(hubRoot, "changes/2026-04-19-focus-component.json"), "utf8")
    );
    assert.equal(changeRecord.id, "add-focus-component");
    assert.equal(changeRecord.trigger, "layout_patch");
    assert.equal(changeRecord.risk_level, 1);
    assert.equal(changeRecord.growth_log, true);
    assert.match(changeRecord.changes[0].summary, /focus-card/);

    assert.deepEqual((await validateHub(hubRoot)).errors, []);
  } finally {
    await rm(hubRoot, { recursive: true, force: true });
  }
});

test("refuses to apply when dry-run reports safety errors", async () => {
  const hubRoot = await copyFixture("invalid-dry-run");

  try {
    const result = await applyPatch(hubRoot, "patches/add-missing-component.yaml");

    assert.equal(result.status, "rejected");
    assert.match(result.errors.join("\n"), /missing component: missing-growth-card/);
    assert.deepEqual(result.writtenFiles, []);
  } finally {
    await rm(hubRoot, { recursive: true, force: true });
  }
});

test("refuses to overwrite an existing change record", async () => {
  const hubRoot = await copyFixture("apply-add-component");

  try {
    assert.equal(
      (await applyPatch(hubRoot, "patches/add-focus-component.yaml")).status,
      "applied"
    );

    const secondApply = await applyPatch(hubRoot, "patches/add-focus-component.yaml");

    assert.equal(secondApply.status, "rejected");
    assert.match(secondApply.errors.join("\n"), /change record already exists/);
    assert.deepEqual(secondApply.writtenFiles, []);
  } finally {
    await rm(hubRoot, { recursive: true, force: true });
  }
});

test("CLI applies a patch and reports written files", async () => {
  const hubRoot = await copyFixture("apply-add-component");

  try {
    const { stdout } = await execFileAsync(process.execPath, [
      "packages/patch-engine/src/applyCli.js",
      hubRoot,
      "patches/add-focus-component.yaml"
    ]);

    assert.match(stdout, /Patch: add-focus-component/);
    assert.match(stdout, /Result: applied/);
    assert.match(stdout, /hub\.manifest\.yaml/);
    assert.match(stdout, /changes\/2026-04-19-focus-component\.json/);
  } finally {
    await rm(hubRoot, { recursive: true, force: true });
  }
});
