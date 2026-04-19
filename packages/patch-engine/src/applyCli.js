#!/usr/bin/env node
import { applyPatch } from "./applyPatch.js";

function formatResult(result) {
  const lines = [
    `Patch: ${result.patchId}`,
    `Result: ${result.status}`,
    "Written files:",
    ...result.writtenFiles.map((file) => `- ${file}`)
  ];

  if (result.errors.length > 0) {
    lines.push("Errors:", ...result.errors.map((error) => `- ${error}`));
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const [, , hubRoot, patchPath] = process.argv;

  if (!hubRoot || !patchPath) {
    console.error("Usage: node packages/patch-engine/src/applyCli.js <hub-root> <patch-path>");
    process.exitCode = 1;
    return;
  }

  const result = await applyPatch(hubRoot, patchPath);
  process.stdout.write(formatResult(result));

  if (result.status !== "applied") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
