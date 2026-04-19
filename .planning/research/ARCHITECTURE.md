# Architecture Research

**Domain:** Undo Engine for file-based patch system in Hermes Personal Hub
**Researched:** 2026-04-19
**Confidence:** HIGH

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Command Layer (CLI/Host API)                │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Undo CLI    │  │ Undo Dry-Run│  │ Undo Apply  │            │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘            │
│         │                │                │                    │
├─────────┴────────────────┴────────────────┴────────────────────┤
│                     Patch Engine Layer                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Undo Engine (packages/patch-engine)          │   │
│  └─────────────────────────────────────────────────────────┘   │
│         ┌──────────────────┐          ┌──────────────────┐     │
│         │ Change Loader    │          │ Rollback Executor│     │
│         │ Pre-undo Checker │          │ Undo Recorder    │     │
│         └──────────────────┘          └──────────────────┘     │
├─────────────────────────────────────────────────────────────────┤
│                     Validation Layer                            │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐                    │
│  │ Schema Validation│  │ Ref Checker      │                    │
│  └──────────────────┘  └──────────────────┘                    │
├─────────────────────────────────────────────────────────────────┤
│                       File System Layer                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────┐  │
│  │ Hub Manifest     │  │ Changes/         │  │ Undos/       │  │
│  │ Components/      │  │  change records  │  │  undo records│  │
│  └──────────────────┘  └──────────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Boundaries

| Component | Responsibility | Communicates With | Where It Lives |
|-----------|----------------|-------------------|----------------|
| **Undo CLI** | Parse user/agent command, invoke undo workflow | Undo Dry-Run, Undo Apply | `packages/patch-engine/src/undoCli.js` |
| **Undo Dry-Run** | Verify undo is safe without modifying files | Change Loader, Pre-undo Checker, Validator | `packages/patch-engine/src/undoDryRun.js` |
| **Undo Apply** | Execute rollback operations, record undo | Rollback Executor, Undo Recorder, Validator | `packages/patch-engine/src/undoApply.js` |
| **Change Loader** | Load original change record and patch | File System, Schemas | `packages/patch-engine/src/undoLoader.js` |
| **Pre-undo Checker** | Verify files still match expected state, check for concurrent modifications | Validator, Hub Loader | `packages/patch-engine/src/undoCheck.js` |
| **Rollback Executor** | Execute rollback operations (remove component, delete file, etc.) | Hub Manifest, File System | `packages/patch-engine/src/rollbackExecutor.js` |
| **Undo Recorder** | Write undo record to changes/ directory for audit | File System | `packages/patch-engine/src/undoRecorder.js` |

## Recommended Project Structure

```
packages/patch-engine/
├── src/
│   ├── dryRunPatch.js        # Existing (patch dry-run)
│   ├── applyPatch.js         # Existing (patch apply)
│   ├── undoDryRun.js         # Pre-undo validation without writes
│   ├── undoApply.js          # Execute undo operations
│   ├── undoCli.js            # CLI entry point
│   ├── undoLoader.js         # Load change/patch for undo
│   ├── undoCheck.js          # Pre-undo safety checks
│   ├── rollbackExecutor.js   # Execute individual rollback ops
│   └── undoRecorder.js       # Write undo audit record
└── test/
    ├── dryRunPatch.test.js   # Existing
    ├── applyPatch.test.js    # Existing
    └── undoApply.test.js     # Undo integration tests
```

### Structure Rationale

- **Co-locate within patch-engine:** Undo is a natural extension of the existing patching system, sharing dependencies on validator and file system operations. No need for a separate package at this stage.
- **Separate dry-run from apply:** Maintains the same safety pattern as the existing patch workflow - always preview before writing.
- **Extract checker/executor/recorder:** Single-responsibility principle makes each component testable independently.

## Patterns to Follow

### Pattern 1: Mirror the Patch Workflow Pattern

**What:** Reuse the same "dry-run first, apply second" safety pattern that already exists for patches.

**When to use:** Always - consistency with existing mental model and proven safety boundary.

**Trade-offs:**
- (+) Same interface pattern for both patch and undo, easier to maintain
- (+) Dry-run allows user/agent to confirm before applying
- (-) Some code duplication with patch engine; acceptable because domain is slightly different

**Example:**
```javascript
// Same calling pattern as applyPatch
async function undoChange(hubRoot, changeId, options = {}) {
  const report = await undoDryRun(hubRoot, changeId);
  if (report.status !== 'passed') {
    return { status: 'rejected', errors: report.errors };
  }
  // Only execute if dry-run passes all checks
  return executeUndo(report);
}
```

### Pattern 2: Pre-Undo State Verification

**What:** Before executing undo, check that files haven't been modified since the original patch was applied.

**When to use:** Always in a file-based system - prevents undo from corrupting concurrent changes.

**Trade-offs:**
- (+) Prevents undoing over already-changed files
- (+) Fails fast instead of partially applying
- (-) Can false-positive if manual edits happened; this is intentional safety

**Example:**
```javascript
// For a file creation rollback: check that the file still exists before deleting
function checkFileExists(expectedPath, hubRoot) {
  if (!await pathExists(path.join(hubRoot, expectedPath))) {
    return {
      safe: false,
      error: `File to delete ${expectedPath} no longer exists, cannot safely undo`
    };
  }
  return { safe: true };
}

// For a manifest change: verify the component is still present before removing
function checkComponentInManifest(manifest, componentId, sectionId) {
  const section = findHomeSection(manifest, sectionId);
  if (!section || !section.components?.includes(componentId)) {
    return {
      safe: false,
      error: `Component ${componentId} not found in section ${sectionId}, cannot safely undo`
    };
  }
  return { safe: true };
}
```

### Pattern 3: Record Everything, Delete Safely

**What:** Every undo operation creates an undo record before modifying any files. Files marked for deletion are moved to archive instead of deleted immediately.

**When to use:** File-based systems where audit and recovery matter.

**Trade-offs:**
- (+) Complete audit trail: change → undo → undo-record
- (+) Archives preserve content instead of permanent deletion
- (-) Disk space usage grows over time; users can archive old changes manually

## Data Flow

### Undo Operation Flow

```
User/Agent invokes undo on change_id
    ↓
Undo CLI parses request
    ↓
Change Loader loads original change record → extracts patch_id → finds original patch
    ↓
Pre-undo Checker:
    • Verify all files to be modified still exist in expected state
    • Verify no concurrent modifications
    • Validate hub is currently valid
    ↓
Dry-run reports status: passed/failed, lists operations, warnings
    ↓
[if dry-run failed] → return error, no changes made
[if dry-run passed] → execute operations:

Rollback Executor:
  For op: remove_component → remove component_id from manifest section
  For op: delete_file → move file to archive/ instead of unlink
  For op: remove_change_record → move change record to archive
    ↓
Hub is re-validated after all operations
    ↓
Undo Recorder writes undo record to changes/ directory
    ↓
Return result with written files, undo record id
```

### Key Data Flow Notes

1. **Origin of rollback operations:** Rollback operations are already stored in the original layout patch in `patch.rollback.operations`. The undo engine doesn't need to infer them - they're declared upfront when the patch is created.

2. **Archive location:** Deleted files go to `archive/<date>/` to preserve content while keeping working directories clean.

3. **Validation happens twice:** Once before any changes (pre-check), once after all changes (post-undo). Ensures hub remains valid.

## Build Order

Dependency-based build order:

### Step 1: Undo Loader
- Loads change record from `changes/` directory
- Resolves reference to original patch
- Extracts rollback operations
- **Dependencies:** only `readFile`, YAML parser
- **Test first:** can be unit tested without other undo components

### Step 2: Pre-undo Checker
- Implements safety checks for each rollback operation type
- Uses existing validator for cross-reference checks
- **Dependencies:** Undo Loader, Validator
- **Critical:** this is the safety boundary, must be built before execution

### Step 3: Rollback Executor
- Implements each rollback operation (remove_component, delete_file, etc.)
- Moves files to archive
- Updates manifest
- **Dependencies:** Pre-undo Checker, fs/promises
- **Test with:** fixture hub that has known state

### Step 4: Undo Recorder
- Writes undo record following `undo-record.schema.json`
- **Dependencies:** none beyond file writing
- **Simple:** can be built in parallel with executor

### Step 5: Undo Dry-Run
- Composes loader → checker → reports result
- Does not modify files
- **Dependencies:** Loader, Checker
- **Reuses pattern:** similar to existing `dryRunPatch.js`

### Step 6: Undo Apply
- Composes dry-run → executor → recorder → post-validation
- **Dependencies:** all previous components
- **Top-level entry point after CLI**

### Step 7: Undo CLI
- Command-line interface
- Parses arguments, invokes undo apply
- **Dependencies:** Undo Apply
- **Last:** because it's just a wrapper

### Build Order Summary

```
1. undoLoader.js
   ↓
2. undoCheck.js (pre-undo checker)
   ↓
3. rollbackExecutor.js + undoRecorder.js (can build in parallel)
   ↓
4. undoDryRun.js
   ↓
5. undoApply.js
   ↓
6. undoCli.js
   ↓
7. Tests (undoApply.test.js)
```

## Scalability Considerations

| Concern | At 100 changes | At 1,000 changes | At 10,000 changes |
|---------|----------------|------------------|-------------------|
| **File lookups** | Direct path resolution is fine | Direct path resolution is fine | Consider indexing change records in manifest |
| **Undo history** | Store all records directly in changes/ | Store all records directly in changes/ | Periodic archiving to external storage |
| **Validation time** | Full validation is fine | Full validation is fine | Incremental validation after undo |

For a personal hub (single user), this architecture scales indefinitely. The bottleneck will be full hub validation after each undo, which can be optimized later with incremental validation if needed.

## Anti-Patterns to Avoid

### Anti-Pattern 1: In-Memory Undo Stack

**What people do:** Keep an undo stack in memory with full copies of previous state.

**Why it's wrong:**
- Doesn't work with file-based persistence where changes are made to disk
- Doesn't survive process restarts
- Memory footprint grows with history

**Instead:** Use file-based change records where rollback operations are declared when the original patch is created. This is persistent, survives restarts, and doesn't consume in-memory stack space.

### Anti-Pattern 2: Deleting Files Immediately

**What people do:** Unlink/delete files directly when undoing a creation.

**Why it's wrong:** If the undo has a bug or the user changes their mind immediately after, the content is gone forever.

**Instead:** Move files to an `archive/` directory with date-based organization. This preserves content for recovery while keeping the working hub clean. Permanent deletion can be a separate explicit operation.

### Anti-Pattern 3: Skipping Post-Undo Validation

**What people do:** Only validate before undo, assume everything went well if operations didn't error.

**Why it's wrong:** The combination of operations could leave the hub in an inconsistent state (e.g., broken references).

**Instead:** Always run full hub validation after completing undo. Fails the undo if the resulting hub is invalid and can roll back the rollback if needed.

### Anti-Pattern 4: Putting Undo Engine in a Separate Package Too Early

**What people do:** Create `undo-engine/` as a separate top-level package because it feels like a separate concern.

**Why it's wrong:** Undo is tightly coupled to patch engine data structures and needs direct access to the same file operations. Separation at this stage would create unnecessary dependency churn.

**Instead:** Co-locate within `patch-engine/` package. Extract to separate package later if it becomes a large, independently versioned component.

## Integration Points

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| **Undo Engine ↔ Validator** | Direct function calls | Undo depends on validator for pre and post validation. This is already an existing dependency of patch-engine. |
| **Undo Engine ↔ Schemas** | Schema reference | Schemas already include `undo-record.schema.json`. No new schema work needed beyond what exists. |
| **Undo Engine ↔ Patch Engine** | Direct imports | Undo imports existing `dryRunPatch` and shares patterns. No new cross-package dependencies needed. |

## Sources

- Existing project architecture documentation
- Current patch-engine implementation (`applyPatch.js`, `dryRunPatch.js`)
- Existing schemas: `layout-patch.schema.json`, `undo-record.schema.json`, `change.schema.json`
- Roadmap recommendations from core runtime roadmap

---

*Architecture research for: Undo Engine in file-based patch system*
*Researched: 2026-04-19*
