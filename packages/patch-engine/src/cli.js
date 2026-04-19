#!/usr/bin/env node
import { dryRunPatch } from "./dryRunPatch.js";

function formatOperation(operation) {
  if (operation.op === "add_component") {
    return `- add_component ${operation.componentId} -> ${operation.target} (${operation.result})`;
  }

  if (operation.op === "create_change_record") {
    return `- create_change_record ${operation.file} (${operation.result})`;
  }

  return `- ${operation.op} (${operation.result})`;
}

function formatReport(report) {
  const lines = [
    `Patch: ${report.patchId}`,
    `Risk: ${report.riskLevel}`,
    "Operations:",
    ...report.operations.map(formatOperation),
    `Rollback: ${report.rollback.strategy}`,
    `Result: dry-run ${report.status}`
  ];

  if (report.errors.length > 0) {
    lines.push("Errors:", ...report.errors.map((error) => `- ${error}`));
  }

  return `${lines.join("\n")}\n`;
}

async function main() {
  const [, , hubRoot, patchPath] = process.argv;

  if (!hubRoot || !patchPath) {
    console.error("Usage: node packages/patch-engine/src/cli.js <hub-root> <patch-path>");
    process.exitCode = 1;
    return;
  }

  const report = await dryRunPatch(hubRoot, patchPath);
  process.stdout.write(formatReport(report));

  if (report.status !== "passed") {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
