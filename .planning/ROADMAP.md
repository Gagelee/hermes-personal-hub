# Roadmap: Hermes Personal Hub - Undo Engine

Core Value: Make growth visible and reversible — every automatic change must be inspectable and undoable without breaking the hub.

## Phases

- [ ] **Phase 4: Undo Engine** - Complete implementation of undo functionality for patch changes with safety validation and auditability

## Phase Details

### Phase 4: Undo Engine
**Goal**: Users can safely undo any patch change with proper validation, preview, and auditability
**Depends on**: Phase 3 (Patch apply engine with change records)
**Requirements**: UNDO-01, UNDO-02, UNDO-03, UNDO-04, UNDO-05, UNDO-06, UNDO-07, UNDO-08
**Success Criteria** (what must be TRUE):
  1. User can invoke undo with a change record ID and the engine loads the change record correctly
  2. Pre-undo validation detects when files have been modified since the original change and prevents unsafe undo
  3. Layout policy protection blocks attempts to undo changes that remove protected/pinned components without explicit confirmation
  4. User can preview what an undo will change through dry-run without modifying any files
  5. Undo execution moves created files to an archive instead of deleting them immediately
  6. Post-undo validation confirms the entire hub is still valid after the undo operation completes
  7. Every undo operation creates an undo record in the changes directory for full audit trail
  8. CLI provides a clear entry point for undo commands with human-readable output
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 4. Undo Engine | 0/8 | Not started | - |

---
*Last updated: 2026-04-19*
