import { validateHub } from "./validateHub.js";

const [, , hubRoot, extra] = process.argv;

if (!hubRoot || extra) {
  console.error("Usage: node packages/validator/src/cli.js <hub-root>");
  process.exit(1);
}

const result = await validateHub(hubRoot);

if (result.errors.length > 0) {
  for (const error of result.errors) {
    console.error(error);
  }
  process.exit(1);
}

console.log("Hub validation passed");
