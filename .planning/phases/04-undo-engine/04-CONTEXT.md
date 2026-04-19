# Phase 4: Undo Engine - Context

**Gathered:** 2026-04-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Complete implementation of undo functionality for patch changes with safety validation, preview, and auditability. Users can undo any previously applied patch and the hub remains valid after undo.

This phase delivers on the project's core principle: "Automatic First, Reversible Always".

</domain>

<decisions>
## Implementation Decisions

### Pre-undo Validation
- **D-01:** Verify file modification since original patch by checking **existence + file size**
- Rationale: Balances safety (detects most concurrent modifications) and performance (avoids full file hashing which is unnecessary for this use case)

### Archive Structure
- **D-02:** Store archived files in `{hub}/changes/{change-id}/archive/` alongside the original change record
- Rationale: Keeps all related change metadata together, doesn't spread archived files across the hub, matches existing organizational pattern

### Undo Dry-Run
- **D-03:** Undo must have its own dry-run preview that does not modify any files
- Rationale: Maintains the same safety separation as patch apply (dry-run first, then apply) — users can preview what will change before committing to undo

### CLI Structure
- **D-04:** Create separate `undoCli.js` entry point parallel to existing `applyCli.js`
- Rationale: Preserves consistent structure with the rest of the package: `cli.js` handles dry-run, `applyCli.js` handles apply, `undoCli.js` handles undo — clear separation of concerns matching existing patterns

### Error Handling Strategy
- **D-05:** Follow existing pattern: collect all errors before failing, do not fail fast
- Rationale: Consistent with dry-run/apply — user sees all issues at once, better UX

### Claude's Discretion
- Exact function parameter naming and internal structure follows existing patterns in the patch-engine package
- Test fixture organization mirrors existing test structure (dryRunPatch.test.js, applyPatch.test.js → undoPatch.test.js)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Documentation
- `.planning/PROJECT.md` — Project vision, core value, requirements
- `.planning/REQUIREMENTS.md` — 8 requirements for Phase 4 undo functionality
- `docs/specs/2026-04-17-hermes-personal-hub-design.md` — Overall product design and growth protocol
- `docs/specs/2026-04-19-core-runtime-roadmap.md` — Roadmap with Phase 4 exit criteria

### Existing Code Patterns
- `packages/patch-engine/src/dryRunPatch.js` — Dry-run pattern to follow for undo dry-run
- `packages/patch-engine/src/applyPatch.js` — Apply pattern to follow for undo apply
- `packages/patch-engine/src/applyCli.js` — CLI structure to follow for undo CLI
- `packages/patch-engine/test/` — Test organization and fixture patterns

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `dryRunPatch.js`: Existing dry-run infrastructure (loading hub, reading patch, validation) can be reused for undo dry-run structure
- `applyPatch.js`: Existing error collection pattern applies directly to undo
- `loadHub.js` from validator package: Already handles hub loading for validation
- `validateHub.js` from validator package: Already provides post-undo full hub validation

### Established Patterns
- Separation: dry-run does not modify files, apply/undo modifies files after dry-run passes
- Error collection: Gather all errors before returning, do not fail on first error
- Testing: Fixture-based testing with temp directories cleaned up in finally blocks
- CLI: Separate CLI module for each major operation (dry-run, apply, undo)

### Integration Points
- Undo integrates with existing `patch-engine` package — no new package needed
- Undo uses validator package for pre-undo and post-undo validation
- Change records created by patch-apply already contain the rollback operations that undo will execute

</code_context>

<specifics>
## Specific Ideas

- Follow the exact same error reporting format as dry-run/apply for consistency
- Test fixtures should be created by applying a patch then testing undo brings back the original state
- Archive preserves the full original path so undo can restore to the correct location

</specifics>

<deferred>
## Deferred Ideas

- Full content hash verification of original file — deferred, can be added later if size checking proves insufficient
- Archive pruning policy — deferred, archive can grow indefinitely for now, policy comes later
- Sequential/stacked undo (undo multiple changes in sequence) — deferred to after core single-change undo is validated
- Redo support for undone changes — deferred
- Interactive confirmation prompts for high-risk operations — deferred

None of these affect the current phase scope.

</deferred>

---

*Phase: 04-undo-engine*
*Context gathered: 2026-04-19*
