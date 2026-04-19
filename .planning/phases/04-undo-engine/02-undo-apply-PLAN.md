---
wave: 2
title: Undo Apply Implementation
requirements_addressed:
  - UNDO-04
  - UNDO-05
  - UNDO-06
depends_on:
  - 01-undo-PLAN.md
files_created:
  - (already declared in 01, no new file)
files_modified:
  - packages/patch-engine/src/undoPatch.js
autonomous: true
---

## Summary
Implement the `applyUndo` function that executes rollback operations, moves files to archive, writes undo record, and does post-undo validation.

<read_first>
- `packages/patch-engine/src/undoPatch.js` — the file we created in the previous task that needs the `applyUndo` implementation
- `packages/patch-engine/src/applyPatch.js` — existing apply pattern to follow
- `packages/validator/src/validateHub.js` — post-undo validation uses existing validator
- `.planning/phases/04-undo-engine/04-CONTEXT.md` — archive location decision: `{hub}/changes/{change-id}/archive/`
</read_first>

<acceptance_criteria>
1. `packages/patch-engine/src/undoPatch.js` contains `export async function applyUndo(`
2. `applyUndo` requires `dryRunUndo` to pass before any changes are made (same as applyPatch requires dryRunPatch)
3. `applyUndo` for `remove_component` rollback operation removes component from manifest home section
4. `applyUndo` moves created file to archive instead of deleting it: `{hub}/changes/{change-id}/archive/{original-path}` preserves original path
5. After all operations complete, `applyUndo` calls validator to validate the entire hub
6. `applyUndo` writes an undo record JSON to the changes directory documenting the operation
7. `applyUndo` returns object with: `changeId`, `status`, `errors`, `movedFiles`
</acceptance_criteria>

<action>
1. Edit `packages/patch-engine/src/undoPatch.js` to add the `applyUndo` function after `dryRunUndo`
2. Function signature: `async function applyUndo(hubRoot, changeRecordPath, options = {})`
3. Steps:
   - Call `dryRunUndo` first — fail if dry-run fails (follows applyPatch pattern)
   - Read change record JSON to get rollback operations
   - Read hub manifest
   - For each rollback operation:
     - `remove_component`: remove component id from target section in manifest
     - `remove_change_record`: move the change record file to archive
     - Any other file created by original patch: move file to archive directory
   - After all operations: write updated manifest
   - Create archive directory structure: `{hub-root}/changes/{change-id}/archive/`
   - When moving: create subdirectory matching original relative path
   - Write undo record JSON to: `{hub-root}/changes/{change-id}/undo-{timestamp}.json`
   - Call `validateHub` from validator package to validate entire hub post-undo
   - Collect all errors, return result object
4. Follow the exact same error handling pattern as `applyPatch` — collect all errors before returning
5. Use `fs/promises` `mkdir` with `{ recursive: true }` for creating archive directories
6. Use `node:fs/promises` `rename` to move files to archive (rename is atomic on same filesystem)
</action>
