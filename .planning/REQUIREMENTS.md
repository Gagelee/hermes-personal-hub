# Requirements: Hermes Personal Hub - Undo Engine

**Defined:** 2026-04-19
**Core Value:** Make growth visible and reversible — every automatic change must be inspectable and undoable without breaking the hub.

## v1 Requirements

Requirements for Phase 4 (Undo Engine v0). All table stakes per research.

### Loading & Validation

- [x] **UNDO-01**: Undo engine can load an existing change record from the changes directory
- [x] **UNDO-02**: Pre-undo validation verifies file state matches expected state from change record (detects concurrent modifications)
- [x] **UNDO-03**: Layout policy check verifies no protected/pinned components are being removed without explicit confirmation

### Preview & Execution

- [x] **UNDO-04**: Dry-run undo previews all rollback operations without modifying any files
- [x] **UNDO-05**: Execute rollback operations moves created files to archive instead of deleting immediately
- [x] **UNDO-06**: Post-undo validation validates the entire hub after undo completes to ensure it remains valid

### Audit & CLI

- [x] **UNDO-07**: Undo record is written to the changes/undo directory for full auditability
- [x] **UNDO-08**: CLI entry point accepts hub root path and change record ID, outputs human-readable results

## v2 Requirements

Deferred to future release after core undo is validated.

### Enhanced Undo Features

- **UNDO-09**: Sequential/stacked undo (undo multiple changes in sequence)
- **UNDO-10**: Redo support for undone changes
- **UNDO-11**: Dry-run undo output includes risk level assessment
- **UNDO-12**: Archive pruning policy to clean up old archived files
- **UNDO-13**: Interactive undo with prompt for confirmation on high-risk operations

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Full hub snapshotting | Anti-pattern — inverse patches on change records are already recorded and more space-efficient |
| Git integration for undo | Overkill — adds external dependency not needed for core functionality; keeps design simple and self-contained |
| Bulk undo of multiple changes | Single-change undo meets core "reversible always" requirement; bulk can come later if needed |
| Undo of an undo (redo) | Deferred to v2 — core doesn't need it, v1 only requires undoing original apply |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| UNDO-01 | Phase 4 | Done |
| UNDO-02 | Phase 4 | Done |
| UNDO-03 | Phase 4 | Done |
| UNDO-04 | Phase 4 | Done |
| UNDO-05 | Phase 4 | Done |
| UNDO-06 | Phase 4 | Done |
| UNDO-07 | Phase 4 | Done |
| UNDO-08 | Phase 4 | Done |

**Coverage:**
- v1 requirements: 8 total
- Mapped to phases: 8
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-19*
*Last updated: 2026-04-19 after Phase 4 implementation*
