#!/usr/bin/env node
import { applyUndo } from "./undoPatch.js";
import path from "node:path";

function formatResult(result) {
  const lines = [
    `Change: ${result.changeId}`,
    `Result: ${result.status}`,
    "Moved files:"
  ];

  if (result.movedFiles.length > 0) {
    lines.push(...result.movedFiles.map((file) => `- ${file}`));
  } else {
    lines.push("- (none)");
  }

  if (result.errors.length > 0) {
    lines.push("Errors:", ...result.errors.map((error) => `- ${error}`));
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const [, , hubRoot, changeRecordId] = process.argv;

  if (!hubRoot || !changeRecordId) {
    console.error("Usage: node packages/patch-engine/src/undoCli.js <hub-root> <change-record-id>");
    process.exitCode = 1;
    return;
  }

  // Change record path: changes/{change-id}.json
  const changeRecordPath = path.join("changes", `${changeRecordId}.json`);

  const result = await applyUndo(hubRoot, changeRecordPath);
  process.stdout.write(formatResult(result));

  if (result.status !== "completed") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
