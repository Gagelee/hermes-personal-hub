# Feature Landscape

**Domain:** Undo Engine for patch-based personal growth hub
**Researched:** 2026-04-19
**Confidence:** HIGH

## Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels incomplete.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Undo single change | Every automatic change must be reversible per core design principle | LOW | Rollback using inverse operations already defined in patch |
| Validate Hub state after undo | Undo must leave Hub in valid, usable state | LOW | Reuse existing validator from patch apply phase |
| Refuse unsafe undo | Don't apply rollback if dependencies have changed | MEDIUM | Check file state and references before proceeding |
| Write undo audit record | Every undo action must be logged for learning | LOW | Follows existing change record pattern |
| Remove added component from manifest | Inverse of add_component operation | LOW | Core operation required for MVP |
| Remove change record after undo | Cleanup change record that was undone | LOW | Simple file deletion, already staged in patch |

## Differentiators (Competitive Advantage)

Features that set the product apart. Not required, but valued.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Undo multiple changes in sequence | Allows rolling back a chain of automatic changes | MEDIUM | Builds on single undo, uses change log ordering |
| Dry-run preview of undo | Show what files will change before applying undo | MEDIUM | Reuse dry-run engine pattern from patch apply |
| "Undo undo" (redo) | Restores a change after it was undone by mistake | MEDIUM | Stores original patch with undo record |
| Selective undo within patch | Undo only some operations from a multi-operation patch | HIGH | Requires conflict detection within patch |
| Group undo by session or time range | Bulk undo of multiple automatic changes from a period | HIGH | Navigation by time/chunking improves UX |
| Policy learning from undo | Automatically reduce confidence in similar future changes | MEDIUM | Integrates with Growth Protocol learning loop |
| Protected item safeguard | Prevent undo that would modify user-protected content | LOW | Reuse existing protection policy from validator |

## Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Automatic undo of multiple conflicting changes | Seems easier than user selection | Can lead to unexpected data loss, cascading changes | User selects individual changes to undo |
| Incremental snapshots of entire Hub | Full snapshots provide absolute safety | Exponential storage bloat for daily changes | Inverse patches with change records only |
| Undo of user pin/hide actions | Consistency across all actions | User actions are explicit feedback, shouldn't be auto-rolled back differently | Keep separate undo for agent changes only; user can re-pin manually |
| Undo through arbitrary history | "Everything should be undoable" | Requires complex merge conflict resolution, hard to test | Only undo leaves valid state; refuse when dependencies changed |
| Transparent on-the-fly rebase | Maintains undo history across branches | Complexity explodes with multiple interdependent changes | Linear history per patch, explicit conflict checking |

## Feature Dependencies

```
Undo Multiple Changes
    └──requires──> Single Change Undo
                       └──requires──> Post-Undo Validation

Redo (Undo Undo)
    └──requires──> Single Change Undo

Undo Dry-Run Preview
    └──requires──> Existing Dry-Run Engine
                       └──requires──> Single Change Undo

Policy Learning From Undo
    └──requires──> Growth Protocol Learning
                       └──requires──> Undo Audit Record

Selective Undo
    └──requires──> Full Undo Engine
```

### Dependency Notes

- **Single Change Undo requires Post-Undo Validation:** Must guarantee Hub remains valid after every undo operation
- **Redo requires Single Change Undo:** Needs the undo infrastructure to already be in place
- **Undo Dry-Run Preview requires Existing Dry-Run Engine:** Leverages the dry-run patterns already implemented in Phase 2
- **Policy Learning From Undo requires Growth Protocol Learning:** Feeds undo events into the existing learning system
- **Selective Undo requires Full Undo Engine:** More complex feature that needs core undo working first

## MVP Recommendation

Prioritize:
1. **Single change undo** (core requirement from design principle "Automatic First, Reversible Always")
2. **Post-undo validation** (guarantees Hub doesn't break)
3. **Unsafe undo refusal** (prevents corrupted state)
4. **Undo audit record** (completes the audit trail for learning)

Defer:
- **Multiple/sequential undo:** Can undo one at a time initially; sequential undo adds convenience not safety
- **Redo:** Users rarely need this immediately; can redo by re-applying from history later
- **Selective undo:** High complexity, rarely needed for initial use cases
- **Bulk group undo:** Can wait until users have accumulated significant history

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Single change undo | HIGH | LOW | P1 |
| Post-undo validation | HIGH | LOW | P1 |
| Unsafe undo refusal | HIGH | MEDIUM | P1 |
| Undo audit record | HIGH | LOW | P1 |
| Remove added component | HIGH | LOW | P1 |
| Remove change record | HIGH | LOW | P1 |
| Protected item safeguard | MEDIUM | LOW | P1 |
| Undo dry-run preview | MEDIUM | MEDIUM | P2 |
| Multiple changes sequential undo | MEDIUM | MEDIUM | P2 |
| Redo (undo undo) | MEDIUM | MEDIUM | P2 |
| Policy learning from undo | MEDIUM | MEDIUM | P2 |
| Selective undo within patch | MEDIUM | HIGH | P3 |
| Group undo by time/session | LOW | HIGH | P3 |

**Priority key:**
- P1: Must have for Phase 4 completion
- P2: Should have, add after core works
- P3: Nice to have, future consideration

## Sources

- [Hermes Personal Hub Design](file:///Users/lijiazhi/Projects/hermes-personal-hub/docs/specs/2026-04-17-hermes-personal-hub-design.md)
- [Hermes Core Runtime Roadmap](file:///Users/lijiazhi/Projects/hermes-personal-hub/docs/specs/2026-04-19-core-runtime-roadmap.md)
- [Hermes Growth Protocol](file:///Users/lijiazhi/Projects/hermes-personal-hub/docs/specs/2026-04-19-growth-protocol.md)
