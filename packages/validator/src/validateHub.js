import { loadHub } from "./loadHub.js";
import Ajv2020 from "ajv/dist/2020.js";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const schemaRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../schemas"
);

async function readSchema(name) {
  const schema = await readFile(path.join(schemaRoot, name), "utf8");
  return JSON.parse(schema);
}

async function buildValidators() {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  return {
    manifest: ajv.compile(await readSchema("hub.manifest.schema.json")),
    page: ajv.compile(await readSchema("page.schema.json")),
    component: ajv.compile(await readSchema("component.schema.json")),
    change: ajv.compile(await readSchema("change.schema.json")),
    growthSignal: ajv.compile(await readSchema("growth-signal.schema.json")),
    proposal: ajv.compile(await readSchema("growth-proposal.schema.json")),
    patch: ajv.compile(await readSchema("layout-patch.schema.json")),
    undoRecord: ajv.compile(await readSchema("undo-record.schema.json"))
  };
}

function documentIdMap(documents) {
  return new Map(documents.map((document) => [document.data?.id, document]));
}

function homeComponentIds(manifest) {
  return (manifest.home?.sections ?? []).flatMap((section) => section.components ?? []);
}

async function validateReferences(hub) {
  const errors = [];
  const componentsById = documentIdMap(hub.components);
  const pagesByFile = new Map(hub.pages.map((page) => [page.path, page]));

  for (const componentId of homeComponentIds(hub.manifest.data)) {
    if (!componentsById.has(componentId)) {
      errors.push(`hub.manifest.yaml: missing component: ${componentId}`);
    }
  }

  for (const pageRef of hub.manifest.data.pages ?? []) {
    if (!pagesByFile.has(pageRef.file)) {
      errors.push(`hub.manifest.yaml: missing page file: ${pageRef.file}`);
    }
  }

  for (const page of hub.pages) {
    for (const componentId of page.data?.components ?? []) {
      if (!componentsById.has(componentId)) {
        errors.push(`${page.path}: missing component: ${componentId}`);
      }
    }
  }

  for (const component of hub.components) {
    const dataFile = component.data?.data?.file;
    if (dataFile && !(await hub.pathExists(dataFile))) {
      errors.push(`${component.path}: missing data file: ${dataFile}`);
    }
  }

  return errors;
}

function formatSchemaErrors(filePath, validate) {
  return (validate.errors ?? []).map((error) => `${filePath}: ${error.message}`);
}

async function validateSchemas(hub) {
  const validators = await buildValidators();
  const errors = [];

  if (!validators.manifest(hub.manifest.data)) {
    errors.push(...formatSchemaErrors(hub.manifest.path, validators.manifest));
  }

  for (const page of hub.pages) {
    if (!validators.page(page.data)) {
      errors.push(...formatSchemaErrors(page.path, validators.page));
    }
  }

  for (const component of hub.components) {
    if (!validators.component(component.data)) {
      errors.push(...formatSchemaErrors(component.path, validators.component));
    }
  }

  for (const change of hub.changes) {
    if (!validators.change(change.data)) {
      errors.push(...formatSchemaErrors(change.path, validators.change));
    }
  }

  for (const signal of hub.growthSignals) {
    if (!validators.growthSignal(signal.data)) {
      errors.push(...formatSchemaErrors(signal.path, validators.growthSignal));
    }
  }

  for (const proposal of hub.proposals) {
    if (!validators.proposal(proposal.data)) {
      errors.push(...formatSchemaErrors(proposal.path, validators.proposal));
    }
  }

  for (const patch of hub.patches) {
    if (!validators.patch(patch.data)) {
      errors.push(...formatSchemaErrors(patch.path, validators.patch));
    }
  }

  for (const undoRecord of hub.undoRecords) {
    if (!validators.undoRecord(undoRecord.data)) {
      errors.push(...formatSchemaErrors(undoRecord.path, validators.undoRecord));
    }
  }

  return errors;
}

export async function validateHub(hubRoot) {
  const hub = await loadHub(hubRoot);
  const errors = [
    ...(await validateSchemas(hub)),
    ...(await validateReferences(hub))
  ];
  return { errors };
}
