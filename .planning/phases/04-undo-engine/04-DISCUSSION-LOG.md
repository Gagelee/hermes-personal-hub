# Phase 4: Undo Engine - Discussion Log

> **Audit trail only.** Decisions are captured in `04-CONTEXT.md` — downstream agents use that file. This log preserves the alternatives considered.

**Date:** 2026-04-19  
**Phase:** 4 — Undo Engine  
**Areas discussed:** 4

## Pre-undo Validation

| Option | Description | Selected |
|--------|-------------|----------|
| Check file existence only | Fast but minimal safety | |
| Check existence + file size | Balances safety and performance | ✓ |
| Check full content hash | Maximum safety but slower for large files | |

**Decision:** Check existence + file size. Full hash deferred for later if needed.

## Archive Directory Structure

| Option | Description | Selected |
|--------|-------------|----------|
| `{hub}/archive/` organized by change | Centralized archive | |
| `{hub}/changes/{change-id}/archive/` alongside change record | Co-located with change metadata | ✓ |
| `{hub}/undo/` separate directory | Separate undo | |

**Decision:** Co-locate with change record for discoverability and organizational consistency.

## Dry-run for Undo

| Option | Description | Selected |
|--------|-------------|----------|
| Separate dry-run for undo (preview no changes) | Consistent safety pattern with apply, user can preview | ✓ |
| No dry-run — undo directly | Skip preview, faster but unsafe | |

**Decision:** Require dry-run for undo to maintain the same safety boundary as apply.

## CLI Structure

| Option | Description | Selected |
|--------|-------------|----------|
| Separate `undoCli.js` parallel to `applyCli.js` | Consistent with existing structure, clear separation | ✓ |
| Integrate into existing `cli.js` with subcommand | Single entry point, consolidated | |

**Decision:** Separate CLI entry to match existing pattern.

## Error Handling Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Fail fast on first error | Stop at first error | |
| Collect all errors before failing (existing pattern) | User sees all issues at once | ✓ |

**Decision:** Follow existing pattern — collect all errors.

## Deferred Ideas

- Full content hash verification
- Archive pruning policy
- Sequential/stacked undo
- Redo support
- Interactive confirmation for high-risk operations

---

*Discussion complete. All decisions captured in 04-CONTEXT.md ready for planning.
