import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { dryRunPatch, readPatch } from "./dryRunPatch.js";

function toPath(input) {
  if (input instanceof URL) {
    return fileURLToPath(input);
  }
  return path.resolve(String(input));
}

async function readManifest(root) {
  const content = await readFile(path.join(root, "hub.manifest.yaml"), "utf8");
  return YAML.parse(content);
}

async function writeManifest(root, manifest) {
  await writeFile(path.join(root, "hub.manifest.yaml"), YAML.stringify(manifest), "utf8");
}

function findHomeSection(manifest, sectionId) {
  return (manifest.home?.sections ?? []).find((section) => section.id === sectionId);
}

function addComponent(manifest, operation) {
  const section = findHomeSection(manifest, operation.target?.section);

  if (!section.components) {
    section.components = [];
  }

  if (section.components.includes(operation.component_id)) {
    return false;
  }

  if (operation.target?.position === "top") {
    section.components.unshift(operation.component_id);
  } else {
    section.components.push(operation.component_id);
  }

  return true;
}

function changeSummary(operation) {
  if (operation.op === "add_component") {
    return {
      path: "hub.manifest.yaml",
      action: "add_component",
      summary: `Added ${operation.component_id} to home.${operation.target?.section}.`
    };
  }

  return {
    file: operation.file,
    action: operation.op,
    summary: `Created ${operation.file}.`
  };
}

async function createChangeRecord(root, patch, operation) {
  const absoluteFile = path.join(root, operation.file);
  await mkdir(path.dirname(absoluteFile), { recursive: true });

  const record = {
    id: patch.id,
    trigger: "layout_patch",
    reason: `Applied layout patch ${patch.id}.`,
    risk_level: patch.risk_level,
    changes: (patch.operations ?? []).map(changeSummary),
    public_commit: false,
    growth_log: true
  };

  await writeFile(absoluteFile, `${JSON.stringify(record, null, 2)}\n`, "utf8");
}

export async function applyPatch(hubRoot, patchPath, options = {}) {
  const maxRiskLevel = options.maxRiskLevel ?? 1;
  const root = toPath(hubRoot);
  const report = await dryRunPatch(hubRoot, patchPath);

  if (report.status !== "passed") {
    return {
      patchId: report.patchId,
      status: "rejected",
      errors: report.errors,
      writtenFiles: []
    };
  }

  if (report.riskLevel > maxRiskLevel) {
    return {
      patchId: report.patchId,
      status: "rejected",
      errors: [`risk level ${report.riskLevel} exceeds maximum ${maxRiskLevel}`],
      writtenFiles: []
    };
  }

  const patch = await readPatch(hubRoot, patchPath);
  const manifest = await readManifest(root);
  const writtenFiles = new Set();

  for (const operation of patch.operations ?? []) {
    if (operation.op === "add_component" && addComponent(manifest, operation)) {
      await writeManifest(root, manifest);
      writtenFiles.add("hub.manifest.yaml");
    }

    if (operation.op === "create_change_record") {
      await createChangeRecord(root, patch, operation);
      writtenFiles.add(operation.file);
    }
  }

  return {
    patchId: patch.id,
    status: "applied",
    errors: [],
    writtenFiles: [...writtenFiles]
  };
}
