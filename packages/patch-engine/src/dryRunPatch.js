import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { loadHub } from "../../validator/src/loadHub.js";

function toPath(input) {
  if (input instanceof URL) {
    return fileURLToPath(input);
  }
  return path.resolve(String(input));
}

async function readPatch(hubRoot, patchPath) {
  const root = toPath(hubRoot);
  const relativePath = String(patchPath);
  const content = await readFile(path.join(root, relativePath), "utf8");
  return YAML.parse(content);
}

function componentIds(hub) {
  return new Set(hub.components.map((component) => component.data?.id).filter(Boolean));
}

function homeSections(manifest) {
  return new Map((manifest.home?.sections ?? []).map((section) => [section.id, section]));
}

async function describeOperation(operation, hub, context) {
  if (operation.op === "add_component") {
    const sectionId = operation.target?.section;
    const section = context.sections.get(sectionId);
    const errors = [];

    if (!context.components.has(operation.component_id)) {
      errors.push(`missing component: ${operation.component_id}`);
    }

    if (!section) {
      errors.push(`missing home section: ${sectionId}`);
    }

    return {
      summary: {
        op: "add_component",
        componentId: operation.component_id,
        target: `home.${sectionId}`,
        result: section?.components?.includes(operation.component_id)
          ? "already_present"
          : "would_add"
      },
      errors
    };
  }

  if (operation.op === "create_change_record") {
    const exists = await hub.pathExists(operation.file);
    return {
      summary: {
        op: "create_change_record",
        file: operation.file,
        result: exists ? "already_exists" : "would_create"
      },
      errors: []
    };
  }

  return {
    summary: {
      op: operation.op,
      result: "unrecognized"
    },
    errors: [`unsupported operation: ${operation.op}`]
  };
}

function describeRollbackOperation(operation) {
  if (operation.file) {
    return `${operation.op} ${operation.file}`;
  }

  if (operation.component_id && operation.target?.section) {
    return `${operation.op} ${operation.component_id} -> home.${operation.target.section}`;
  }

  if (operation.component_id) {
    return `${operation.op} ${operation.component_id}`;
  }

  return operation.op;
}

export async function dryRunPatch(hubRoot, patchPath) {
  const hub = await loadHub(hubRoot);
  const patch = await readPatch(hubRoot, patchPath);
  const context = {
    components: componentIds(hub),
    sections: homeSections(hub.manifest.data)
  };

  const described = await Promise.all(
    (patch.operations ?? []).map((operation) => describeOperation(operation, hub, context))
  );
  const errors = described.flatMap((operation) => operation.errors);

  return {
    patchId: patch.id,
    riskLevel: patch.risk_level,
    status: errors.length === 0 ? "passed" : "failed",
    operations: described.map((operation) => operation.summary),
    rollback: {
      strategy: patch.rollback?.strategy,
      operations: (patch.rollback?.operations ?? []).map(describeRollbackOperation)
    },
    errors
  };
}
