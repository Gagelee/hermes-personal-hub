import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { promisify } from "node:util";
import { renderHubPage } from "../src/renderHubPage.js";

const execFileAsync = promisify(execFile);

test("renders a static Life OS home from the public demo Hub", async () => {
  const html = await renderHubPage("examples/personal-hub");

  assert.match(html, /<!doctype html>/i);
  assert.match(html, /Hermes Personal Hub/);
  assert.match(html, /Recent Work/);
  assert.match(html, /Weekly Digest/);
  assert.match(html, /Finance Review Candidate/);
  assert.match(html, /theme\.css/);
  assert.match(html, /hph-display-surface/);
  assert.match(html, /why_here/);
});

test("CLI writes a demo HTML file", async () => {
  const outputDir = await mkdtemp(path.join(tmpdir(), "hph-renderer-"));
  const outputFile = path.join(outputDir, "index.html");

  try {
    const { stdout } = await execFileAsync(process.execPath, [
      "packages/renderer/src/cli.js",
      "examples/personal-hub",
      outputFile
    ]);

    const html = await readFile(outputFile, "utf8");
    assert.match(stdout, /Rendered demo Hub/);
    assert.match(html, /Hermes Personal Hub/);
  } finally {
    await rm(outputDir, { recursive: true, force: true });
  }
});
