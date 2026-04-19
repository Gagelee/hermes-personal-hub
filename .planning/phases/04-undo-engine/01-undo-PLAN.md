---
wave: 1
title: Undo Core Infrastructure
requirements_addressed:
  - UNDO-01
  - UNDO-02
depends_on: []
files_created:
  - packages/patch-engine/src/undoPatch.js
files_modified: []
autonomous: true
---

## Summary
Create the core undo module with `dryRunUndo` function that does pre-undo validation and returns a dry-run report.

<read_first>
- `packages/patch-engine/src/dryRunPatch.js` — copy existing dry-run pattern
- `packages/patch-engine/src/applyPatch.js` — copy existing apply error collection pattern
- `.planning/phases/04-undo-engine/04-CONTEXT.md` — verify our decisions: check file size detection, archive location
- `packages/validator/src/loadHub.js` — confirm loading pattern
</read_first>

<acceptance_criteria>
1. `packages/patch-engine/src/undoPatch.js` exists
2. `packages/patch-engine/src/undoPatch.js` contains `export async function dryRunUndo(`
3. `packages/patch-engine/src/undoPatch.js` contains `export async function applyUndo(`
4. Function `dryRunUndo` accepts `(hubRoot, changeRecordPath)` parameters
5. `dryRunUndo` verifies: change record exists, files match expected size (detect concurrent modifications), layout policy protection checked
6. `dryRunUndo` collects all errors before returning, does not fail fast (matches existing pattern)
7. `dryRunUndo` returns object with: `changeId`, `status`, `operations`, `errors`
</acceptance_criteria>

<action>
1. Create new file `packages/patch-engine/src/undoPatch.js`
2. Import dependencies: `{ readFile, stat }` from "node:fs/promises", `path`, `{ loadHub }` from "../../validator/src/loadHub.js"
3. Implement `dryRunUndo(hubRoot, changeRecordPath)` function:
   - Read and parse the change record JSON from the given path
   - Load the current hub
   - For each rollback operation in `changeRecord.rollback.operations`:
     - Check that the target file exists (if it should exist after undo)
   - For each file that was created by the original patch:
     - Get current file size and compare to expected size from change record
     - Add error if size doesn't match (detects concurrent modification)
   - Check layout policy: if operation removes a protected component → add error
   - Collect all errors, return `{ changeId, status: errors.length ? "failed" : "passed", operations, errors }`
4. Implement skeleton `applyUndo` function (will be completed in next plan) that follows same structure as dryRunUndo
5. Follow existing code style: same indentation, ESM imports, JSDoc style matches existing dryRunPatch.js
</action>
