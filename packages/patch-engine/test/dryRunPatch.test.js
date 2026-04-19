import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { test } from "node:test";
import { promisify } from "node:util";
import { dryRunPatch } from "../src/dryRunPatch.js";

const execFileAsync = promisify(execFile);

test("reports what a layout patch would do without applying it", async () => {
  const report = await dryRunPatch(
    "examples/personal-hub",
    "patches/demo-add-growth-contract.yaml"
  );

  assert.equal(report.patchId, "demo-add-growth-contract");
  assert.equal(report.riskLevel, 1);
  assert.equal(report.status, "passed");
  assert.deepEqual(report.errors, []);
  assert.deepEqual(report.operations, [
    {
      op: "add_component",
      componentId: "demo-agent-growth-log",
      target: "home.operations",
      result: "already_present"
    },
    {
      op: "create_change_record",
      file: "changes/2026-04-19-growth-contract.json",
      result: "would_create"
    }
  ]);
  assert.deepEqual(report.rollback, {
    strategy: "inverse_patch",
    operations: ["remove_change_record changes/2026-04-19-growth-contract.json"]
  });
});

test("reports patch safety errors before apply exists", async () => {
  const report = await dryRunPatch(
    new URL("./fixtures/invalid-dry-run/", import.meta.url),
    "patches/add-missing-component.yaml"
  );

  assert.equal(report.status, "failed");
  assert.match(report.errors.join("\n"), /missing component: missing-growth-card/);
  assert.match(report.errors.join("\n"), /missing home section: missing-section/);
});

test("CLI prints a readable dry-run report", async () => {
  const { stdout } = await execFileAsync(process.execPath, [
    "packages/patch-engine/src/cli.js",
    "examples/personal-hub",
    "patches/demo-add-growth-contract.yaml"
  ]);

  assert.match(stdout, /Patch: demo-add-growth-contract/);
  assert.match(stdout, /Risk: 1/);
  assert.match(stdout, /add_component demo-agent-growth-log -> home\.operations \(already_present\)/);
  assert.match(stdout, /create_change_record changes\/2026-04-19-growth-contract\.json \(would_create\)/);
  assert.match(stdout, /Rollback: inverse_patch/);
  assert.match(stdout, /Result: dry-run passed/);
});
