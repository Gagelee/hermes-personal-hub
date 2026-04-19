import { readFile, writeFile, mkdir, rename, stat as fsStat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { loadHub } from "../../validator/src/loadHub.js";
import { validateHub } from "../../validator/src/validateHub.js";

function toPath(input) {
  if (input instanceof URL) {
    return fileURLToPath(input);
  }
  return path.resolve(String(input));
}

async function readChangeRecord(hubRoot, changeRecordPath) {
  const root = toPath(hubRoot);
  const relativePath = String(changeRecordPath);
  const content = await readFile(path.join(root, relativePath), "utf8");
  return JSON.parse(content);
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

export async function dryRunUndo(hubRoot, changeRecordPath) {
  const hub = await loadHub(hubRoot);
  const errors = [];
  const operations = [];

  let changeRecord;
  try {
    changeRecord = await readChangeRecord(hubRoot, changeRecordPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return {
        changeId: String(changeRecordPath).split("/").pop()?.replace(".json", "") ?? "unknown",
        status: "failed",
        operations: [],
        errors: [`change record not found: ${changeRecordPath}`]
      };
    }
    throw error;
  }

  for (const operation of changeRecord.rollback?.operations ?? []) {
    operations.push(describeRollbackOperation(operation));

    if (operation.op === "remove_component") {
      // Will check during apply that it exists - dryRun just needs to know it's there
      continue;
    }

    if (operation.op === "remove_change_record") {
      const exists = await hub.pathExists(changeRecordPath);
      if (!exists) {
        errors.push(`change record does not exist: ${changeRecordPath}`);
      }
    }
  }

  // Check files created by original patch - verify they haven't changed size
  const createdFiles = (changeRecord.changes ?? [])
    .map(change => change.file)
    .filter(Boolean);

  for (const filePath of createdFiles) {
    const absolutePath = path.join(hub.root, filePath);
    try {
      const stats = await fsStat(absolutePath);
      // Get expected size from change record
      const change = changeRecord.changes.find(c => c.file === filePath);
      if (change?.expectedSize !== undefined && stats.size !== change.expectedSize) {
        errors.push(
          `file size mismatch: ${filePath} - expected ${change.expectedSize}, got ${stats.size}`
        );
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        errors.push(`file not found: ${filePath}`);
      } else {
        throw error;
      }
    }
  }

  // Check layout policy - if operation removes a protected component, add error
  // Protected components are not in the manifest, so check they exist in home
  const homeComponentIds =
    (hub.manifest.data.home?.sections ?? [])
      .flatMap(section => section.components ?? []);

  for (const operation of changeRecord.rollback.operations ?? []) {
    if (operation.op === "remove_component" && operation.target?.section) {
      const section = (hub.manifest.data.home?.sections ?? [])
        .find(s => s.id === operation.target.section);
      if (!section) {
        errors.push(`home section not found: ${operation.target.section}`);
      } else {
        const hasComponent = (section.components ?? [])
          .includes(operation.component_id);
        if (!hasComponent) {
          errors.push(
            `component ${operation.component_id} not found in home.${operation.target.section}`
          );
        }

        // Check if component is protected (pinned)
        // Protected components have a pin flag in the manifest section config
        if (section.protected === true && hasComponent) {
          errors.push(
            `cannot remove protected component ${operation.component_id} from protected section home.${operation.target.section}`
          );
        }
      }
    }
  }

  return {
    changeId: changeRecord.id,
    status: errors.length === 0 ? "passed" : "failed",
    operations,
    errors
  };
}

async function readManifest(root) {
  const content = await readFile(path.join(root, "hub.manifest.yaml"), "utf8");
  return JSON.parse(JSON.stringify(content));
}

async function readManifestYaml(root) {
  const content = await readFile(path.join(root, "hub.manifest.yaml"), "utf8");
  return YAML.parse(content);
}

async function writeManifestYaml(root, manifest) {
  await writeFile(path.join(root, "hub.manifest.yaml"), YAML.stringify(manifest), "utf8");
}

function findHomeSection(manifest, sectionId) {
  return (manifest.home?.sections ?? []).find((section) => section.id === sectionId);
}

function removeComponent(manifest, operation) {
  const section = findHomeSection(manifest, operation.target?.section);
  if (!section || !Array.isArray(section.components)) {
    return false;
  }

  const initialLength = section.components.length;
  section.components = section.components.filter((id) => id !== operation.component_id);
  return section.components.length !== initialLength;
}

export async function applyUndo(hubRoot, changeRecordPath, options = {}) {
  const root = toPath(hubRoot);
  const dryRunReport = await dryRunUndo(hubRoot, changeRecordPath);

  if (dryRunReport.status !== "passed") {
    return {
      changeId: dryRunReport.changeId,
      status: "rejected",
      errors: dryRunReport.errors,
      movedFiles: []
    };
  }

  const changeRecord = await readChangeRecord(hubRoot, changeRecordPath);
  const manifest = await readManifestYaml(root);
  const errors = [];
  const movedFiles = [];

  // Create archive directory: {hub-root}/changes/{change-id}/archive/
  const changeId = changeRecord.id;
  const changeDir = path.dirname(path.join(root, String(changeRecordPath)));
  const archiveDir = path.join(changeDir, "archive");
  await mkdir(archiveDir, { recursive: true });

  // Execute each rollback operation
  for (const operation of changeRecord.rollback.operations ?? []) {
    if (operation.op === "remove_component") {
      removeComponent(manifest, operation);
      continue;
    }

    if (operation.op === "remove_change_record" || operation.op === "remove_file") {
      // Any other file created by original patch - move to archive instead of deleting
      const sourcePath = operation.op === "remove_change_record"
        ? path.join(root, String(changeRecordPath))
        : path.join(root, operation.file);

      // Preserve original path structure in archive: archive/{original-path}
      const originalRelativePath = operation.op === "remove_change_record"
        ? changeRecordPath
        : operation.file;

      // Create parent directories in archive
      const targetPath = path.join(archiveDir, path.dirname(originalRelativePath));
      await mkdir(targetPath, { recursive: true });

      // Full target path with filename
      const targetFullPath = path.join(archiveDir, originalRelativePath);

      try {
        // Use rename (atomic move)
        await rename(sourcePath, targetFullPath);
        movedFiles.push({
          originalPath: originalRelativePath,
          archivePath: path.relative(root, targetFullPath)
        });
      } catch (err) {
        errors.push(`failed to move ${originalRelativePath} to archive: ${err.message}`);
      }
    }
  }

  // Write updated manifest if it changed
  await writeManifestYaml(root, manifest);

  // Write undo record JSON: {hub-root}/undo/undo-{timestamp}.json
  const timestamp = Date.now();
  const undoDir = path.join(root, "undo");
  const undoRecordPath = path.join(undoDir, `undo-${timestamp}.json`);
  await mkdir(undoDir, { recursive: true });

  const undoRecord = {
    id: `${changeId}-undo-${timestamp}`,
    created_at: new Date().toISOString(),
    change_id: changeId,
    reason: `Undo applied for change ${changeId}`,
    operations: changeRecord.rollback?.operations ?? []
  };

  await writeFile(undoRecordPath, JSON.stringify(undoRecord, null, 2) + '\n', "utf8");

  // Post-undo validation - validate entire hub
  const validation = await validateHub(hubRoot);
  errors.push(...validation.errors);

  return {
    changeId,
    status: errors.length === 0 ? "completed" : "completed_with_errors",
    errors,
    movedFiles: movedFiles.map(mf => mf.originalPath)
  };
}
