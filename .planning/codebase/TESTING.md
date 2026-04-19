# Testing Patterns

**Analysis Date:** 2026-04-19

## Test Framework

**Runner:**
- Node.js built-in `node:test` - native test runner, no external dependencies
- Config: No separate config file, configured via package.json script

**Assertion Library:**
- Node.js built-in `node:assert/strict` - strict mode assertions

**Run Commands:**
```bash
npm test              # Run all tests across all packages
npm test              # Same as above (no separate watch/coverage commands)
```

## Test File Organization

**Location:**
- Co-located with source: Each package has a `test/` directory at the package root
- Mirrors src structure: `packages/{package}/test/` tests `packages/{package}/src/`

**Naming:**
- Pattern: `{featureName}.test.js` - lowercase with hyphens
- Example: `dryRunPatch.test.js`, `applyPatch.test.js`, `renderHubPage.test.js`, `validateHub.test.js`

**Structure:**
```
packages/
├── {package-name}/
│   ├── src/
│   │   └── *.js           # Source files
│   ├── test/
│   │   ├── *.test.js      # Test files
│   │   └── fixtures/      # Test data fixtures
│   └── ...
```

## Test Structure

**Suite Organization:**
```javascript
import assert from "node:assert/strict";
import { test } from "node:test";
import { functionUnderTest } from "../src/module.js";

test("descriptive test name", async () => {
  const result = await functionUnderTest(args);
  assert.equal(result.status, "expected");
  assert.deepEqual(result.errors, []);
});
```

**Patterns:**
- Top-level `test()` calls, no explicit `describe()` blocks
- Async/await for all asynchronous operations
- Setup/teardown via try/finally blocks for temp directory cleanup
- Direct assertions on results, no complex setup required

**Setup pattern:**
```javascript
// Temp directory setup with automatic cleanup
const outputDir = await mkdtemp(path.join(tmpdir(), "prefix-"));
try {
  // test operations here
} finally {
  await rm(outputDir, { recursive: true, force: true });
}
```

## Mocking

**Framework:** No mocking framework used

**Patterns:**
- No explicit mocking in current tests
- Tests use real filesystem operations with temp directories
- Direct CLI invocation via `execFile` for integration testing

**What to Mock:**
- Not currently practiced - all tests use real implementations

**What NOT to Mock:**
- All dependencies are used directly in current test patterns

## Fixtures and Factories

**Test Data:**
- Static file fixtures stored in `test/fixtures/` directories
- Each test case has its own fixture directory with pre-constructed hub trees

Example:
```
packages/validator/test/fixtures/
├── valid-hub/           # Minimal valid hub for testing
├── invalid-schema/      # Schema validation failure test
├── valid-growth-hub/    # Hub with growth protocol objects
└── ...
```

Fixture loading:
```javascript
// URL-based import for local fixtures
const result = await validateHub(new URL("./fixtures/valid-hub/", import.meta.url));

// For temp directory tests
async function copyFixture(name) {
  const root = await mkdtemp(path.join(tmpdir(), "prefix-"));
  await cp(new URL(`./fixtures/${name}/`, import.meta.url), root, { recursive: true });
  return root;
}
```

**Location:**
- Fixtures co-located with test files: `packages/{package}/test/fixtures/`

## Coverage

**Requirements:** None enforced

**View Coverage:**
No built-in coverage command configured. Node.js test runner can generate coverage with:
```bash
node --test --coverage packages/*/test/*.test.js
```

## Test Types

**Unit Tests:**
- Tests individual functions in isolation
- Uses actual dependencies, no mocking
- Examples:
  - `packages/renderer/test/renderHubPage.test.js` - tests direct function output
  - `packages/validator/test/validateHub.test.js` - tests validation function with different fixtures

**Integration Tests:**
- Tests complete workflows including CLI execution
- Invokes CLI commands via `execFile` and checks stdout/output files
- Uses temporary directories for file-writing tests to avoid polluting source tree
- Examples:
  - `packages/patch-engine/test/applyPatch.test.js` - full patching workflow with schema validation cross-package
  - All tests include CLI integration checks

**E2E Tests:**
- Not used - all tests are at package/module level

## Common Patterns

**Async Testing:**
```javascript
// All async operations use async/await
test("async operation", async () => {
  const result = await asyncFunction(args);
  assert.equal(result.status, "expected");
});
```

**Error Testing:**
```javascript
// Check for expected error messages via regex matching
const result = await validateHub(invalidFixture);
assert.match(result.errors.join("\n"), /error pattern/);
```

**File System Testing:**
- Uses Node.js `fs/promises` with temp directories
- Always cleans up temp directories in finally blocks
- Copies read-only fixtures to temp directories for mutable operations

**Cross-package Testing:**
- Tests can import from other packages using relative paths:
  ```javascript
  import { validateHub } from "../../validator/src/validateHub.js";
  ```

---

*Testing analysis: 2026-04-19*
