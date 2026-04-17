import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

function toPath(input) {
  if (input instanceof URL) {
    return fileURLToPath(input);
  }
  return path.resolve(String(input));
}

async function pathExists(filePath) {
  try {
    await readFile(filePath);
    return true;
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

async function readYaml(root, relativePath) {
  const absolutePath = path.join(root, relativePath);
  const content = await readFile(absolutePath, "utf8");
  return {
    path: relativePath,
    data: YAML.parse(content)
  };
}

async function readJson(root, relativePath) {
  const absolutePath = path.join(root, relativePath);
  const content = await readFile(absolutePath, "utf8");
  return {
    path: relativePath,
    data: JSON.parse(content)
  };
}

async function readDocuments(root, directory, extension, reader) {
  const absoluteDirectory = path.join(root, directory);
  let entries;
  try {
    entries = await readdir(absoluteDirectory, { withFileTypes: true });
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  const files = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => path.posix.join(directory, entry.name))
    .sort();

  return Promise.all(files.map((file) => reader(root, file)));
}

export async function loadHub(hubRoot) {
  const root = toPath(hubRoot);

  return {
    root,
    manifest: await readYaml(root, "hub.manifest.yaml"),
    pages: await readDocuments(root, "pages", ".yaml", readYaml),
    components: await readDocuments(root, "components", ".yaml", readYaml),
    changes: await readDocuments(root, "changes", ".json", readJson),
    pathExists: (relativePath) => pathExists(path.join(root, relativePath))
  };
}
