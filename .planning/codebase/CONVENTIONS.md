# Coding Conventions

**Analysis Date:** 2026-04-19

## Naming Patterns

**Files:**
- kebab-case with `.js` extension for all source files
- Examples: `dryRunPatch.js` (exception: camelCase in filename when function name is camelCase), `applyPatch.js`, `validateHub.js`, `renderHubPage.js`
- Test files: same kebab-case with `.test.js` suffix
- Examples: `dryRunPatch.test.js`, `applyPatch.test.js`

**Functions:**
- camelCase for function names
- Examples: `dryRunPatch()`, `applyPatch()`, `validateHub()`, `readPatch()`, `componentIds()`
- Descriptive verb-based naming preferred

**Variables:**
- camelCase for variables
- Examples: `hubRoot`, `patchPath`, `errors`, `componentsById`
- `const` for all non-reassigned variables, `let` when reassignment needed
- No `var` usage

**Types:**
- JavaScript (no TypeScript in current codebase)
- JSDoc type annotations not used consistently

## Code Style

**Formatting:**
- No dedicated formatting tool configured
- 2-space indentation observed throughout codebase
- Unix line endings
- Semicolons required at end of statements
- Arrow functions without braces for simple callbacks
- Trailing commas not used in object/array literals

**Linting:**
- No linting configuration detected
- No ESLint, Biome, or other linting tools in use

## Import Organization

**Order:**
1. Node.js built-in imports (with `node:` protocol prefix)
2. Third-party external packages
3. Internal relative imports from other modules
4. One blank line separates groups

Example pattern:
```javascript
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import { loadHub } from "../../validator/src/loadHub.js";
```

**Path Aliases:**
- No path aliases used
- All imports use relative paths with `.js` extension explicitly included

## Error Handling

**Patterns:**
- Accumulate errors in arrays and return them rather than throwing for validation operations
- `try/catch` used for expected file not found cases
- Errors are collected and returned to caller rather than thrown for validation/analysis operations
- Schema validation errors formatted with file path prefixes for easier debugging
- Top-level CLI commands let errors propagate for natural exit codes

Example:
```javascript
async function validateReferences(hub) {
  const errors = [];
  // ... check references, push to errors ...
  return errors;
}
```

## Logging

**Framework:** No logging framework used
- `console.log` only used in CLI entry points for user output
- Library code returns values, does not log
- No debug logging in production code

**Patterns:**
- CLI output is human-readable plain text
- Errors printed to stdout by convention in current CLIs

## Comments

**When to Comment:**
- Very few comments in codebase
- Self-documenting code preferred with clear function/variable names
- No redundant comments explaining what the code already clearly shows

**JSDoc/TSDoc:**
- Not used in current codebase
- No doc comments on exported functions

## Function Design

**Size:**
- Functions are generally small and focused on a single responsibility
- Largest functions are ~130 lines (validation schema checking), most under 50 lines
- Pure functions preferred where possible

**Parameters:**
- Positional parameters with default values for options
- Example: `async function applyPatch(hubRoot, patchPath, options = {})`
- Parameter count kept low (under 4 arguments typical)

**Return Values:**
- Functions return structured objects with clear property names
- Success/failure indicated by status property rather than throwing in most library code
- Example: `return { status: "applied", errors: [], writtenFiles: [...] }`

## Module Design

**Exports:**
- Each module exports the primary function it contains plus any helpers needed by other modules
- Named exports used exclusively (no default exports)
- Example: `export async function dryRunPatch() { ... }`

**Barrel Files:**
- No barrel files used
- Each module imported directly from its full path

---

*Convention analysis: 2026-04-19*
