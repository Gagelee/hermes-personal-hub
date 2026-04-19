import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { renderHubPage } from "./renderHubPage.js";

const [, , hubRoot, outputFile, extra] = process.argv;

if (!hubRoot || !outputFile || extra) {
  console.error("Usage: node packages/renderer/src/cli.js <hub-root> <output-file>");
  process.exit(1);
}

const html = await renderHubPage(hubRoot);
await mkdir(path.dirname(outputFile), { recursive: true });
await writeFile(outputFile, html);

console.log(`Rendered demo Hub to ${outputFile}`);
