import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { test } from "node:test";
import { promisify } from "node:util";
import { validateHub } from "../src/validateHub.js";

const execFileAsync = promisify(execFile);

test("validates a minimal valid Hub tree", async () => {
  const result = await validateHub(new URL("./fixtures/valid-hub/", import.meta.url));
  assert.deepEqual(result.errors, []);
});

test("reports manifest component references that do not exist", async () => {
  const result = await validateHub(new URL("./fixtures/invalid-missing-component/", import.meta.url));
  assert.match(result.errors.join("\n"), /missing component: missing-card/);
});

test("reports schema errors with file paths", async () => {
  const result = await validateHub(new URL("./fixtures/invalid-schema/", import.meta.url));
  assert.match(result.errors.join("\n"), /components\/broken.yaml/);
  assert.match(result.errors.join("\n"), /must have required property 'type'/);
});

test("CLI reports success for a valid Hub tree", async () => {
  const { stdout } = await execFileAsync(process.execPath, [
    "packages/validator/src/cli.js",
    "packages/validator/test/fixtures/valid-hub"
  ]);

  assert.match(stdout, /Hub validation passed/);
});

test("validates Hub growth protocol objects", async () => {
  const result = await validateHub(new URL("./fixtures/valid-growth-hub/", import.meta.url));
  assert.deepEqual(result.errors, []);
});

test("reports invalid growth proposal schema errors", async () => {
  const result = await validateHub(new URL("./fixtures/invalid-growth-proposal/", import.meta.url));
  assert.match(result.errors.join("\n"), /proposals\/broken-proposal.yaml/);
  assert.match(result.errors.join("\n"), /must have required property 'risk'/);
});

test("reports invalid layout patch schema errors", async () => {
  const result = await validateHub(new URL("./fixtures/invalid-layout-patch/", import.meta.url));
  assert.match(result.errors.join("\n"), /patches\/broken-patch.yaml/);
  assert.match(result.errors.join("\n"), /must have required property 'rollback'/);
});
