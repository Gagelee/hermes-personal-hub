# Hermes Personal Hub

## What This Is

Hermes Personal Hub is a **Life OS growth layer** built on top of the official Hermes Agent dashboard plugin system. It lets the UI become a durable surface for what the user and agent repeatedly do together, evolving from conversation repetition to persistent interactive display surfaces.

The core idea: repeated work becomes visible components on a growing hub, every automatic change is logged and reversible, and the hub grows according to user trust policies.

## Core Value

Make growth visible and reversible — every automatic change must be inspectable and undoable without breaking the hub.

## Requirements

### Validated

- ✓ Schema definitions for all hub document types (manifest, page, component, change, patch, growth signal, proposal, undo) — Phase 1
- ✓ Hub loading and JSON Schema validation with cross-reference checking — Phase 1
- ✓ Static HTML renderer from hub configuration — Phase 1
- ✓ Patch dry-run engine with risk assessment and operation preview — Phase 2
- ✓ Patch apply engine for low-risk patches with change record creation — Phase 3
- ✓ Supports `add_component` and `create_change_record` operations — Phase 3
- ✓ Change records track rollback operations for future undo — Phase 3

### Active

- [ ] **UNDO-01**: Load change record and verify pre-undo conditions — Verify patch exists, files match expected state, no concurrent modifications
- [ ] **UNDO-02**: Validate layout policy protection before allowing undo — Protected/pinned items cannot be undone without explicit confirmation
- [ ] **UNDO-03**: Dry-run undo preview — Show what operations will run, report risks, no files changed
- [ ] **UNDO-04**: Execute rollback operations from change record — Move created files to archive instead of deleting immediately
- [ ] **UNDO-05**: Post-undo validation — Validate hub is still valid after all operations
- [ ] **UNDO-06**: Write undo record to changes directory for auditability
- [ ] **UNDO-07**: CLI entry point for undo command — Accept hub path and change record ID

### Out of Scope

- [Redo support] — Deferred to Phase 4 follow-up after core undo is validated
- [Bulk/sequential multiple undo] — Deferred, single-change undo meets core requirements
- [Full hub snapshotting] — Anti-pattern, inverse patches on change records are the correct approach
- [Git integration for undo] — Overkill, adds external dependency not needed for core functionality
- [Archive pruning] — Deferred, archive can grow indefinitely for now, pruning policy comes later
- [Undo of an undo (stacked undos)] — Not required for v0, can be added later if needed

## Context

This is an independent iteration of the Personal Hub concept before integration into the official Hermes environment. The project has prioritized building the core runtime semantics (validate → dry-run → apply) before UI polish.

Current structure is a monorepo with four packages:
- `schemas` — JSON Schema definitions
- `validator` — Hub loading and validation
- `patch-engine` — Dry-run and apply (we're adding undo here)
- `renderer` — Static HTML rendering

The patch engine already captures rollback operations in every change record. Undo just needs to execute them safely with proper checks.

## Constraints

- **Tech Stack**: No new npm dependencies required — implement with existing Node.js builtins, ajv, yaml. Keeps it lightweight.
- **Package Boundary**: Undo belongs in `patch-engine` package — undo is a natural extension of patching.
- **Safety**: Must follow same separation of concerns as existing patch engine (dry-run separate from apply, validate before writing).
- **Consistency**: Mirror existing patterns (error collection, CLI structure, testing) from dry-run/apply.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Build undo within existing patch-engine package | Undo is intrinsically coupled to patching, doesn't need separate package | — Pending |
| Execute pre-declared rollback operations from patch | Patches already declare their own inverse operations, no inference needed | — Pending |
| Archive instead of immediate delete | Preserves recovery option while keeping working tree clean | — Pending |
| Validate before AND after undo | Guarantees hub remains valid, catches any issues early | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition**:
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone**:
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-04-19 after project initialization*
