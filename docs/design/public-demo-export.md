# Public Demo Export

Status: Draft  
Date: 2026-04-18  
Scope: Design rules for turning a private Personal Hub into a public-safe demo snapshot.

## Purpose

Hermes Personal Hub should be useful as a real private Life OS before it becomes a public demo. The private working Hub under `.local/personal-hub/` may contain real worlds, summaries, finance review structure, fitness context, automation outputs, and local working state.

The public demo under `examples/personal-hub/` should explain the product without leaking the user's private life.

This document defines how to move from private working state to public demo state safely.

## Principle

Private Hub is for living. Public Demo is for explaining.

The public demo should preserve:

- product shape,
- component model,
- lifecycle statuses,
- Growth Log behavior,
- visual primitives,
- source/provenance patterns,
- promotion model,
- trust boundaries.

The public demo should replace:

- private facts,
- precise personal metrics,
- account details,
- local paths,
- raw automation output,
- unpublished notes,
- sensitive finance or health details.

## Export Model

The first export flow should be conservative and reviewable:

```text
.local/personal-hub/
  -> validate private state
  -> copy structural shape
  -> sanitize sensitive fields
  -> replace private data with fictional or rounded demo data
  -> validate public demo state
  -> run leakage scan
  -> commit examples/personal-hub/
```

The export should not be fully automatic at first. It should produce a reviewable snapshot and require human review before commit.

## Public Demo Target

The public demo should live at:

```text
examples/personal-hub/
  HUB.md
  LAYOUT_POLICY.md
  hub.manifest.yaml
  pages/
  components/
  data/
  changes/
  theme.css
  tokens.css
  primitives.css
```

The existing CSS files are open-source-safe primitives. The state files should be generated or hand-authored from sanitized private structure.

## Sanitization Rules

### Global

Remove or replace:

- absolute local paths,
- usernames,
- private repo names,
- account identifiers,
- API keys,
- token-like strings,
- secrets,
- real emails or phone numbers,
- private file names when they reveal content,
- raw note excerpts,
- raw automation outputs.

Use demo-safe replacements:

- repo-relative paths,
- fictional names,
- rounded values,
- synthetic trends,
- invented summaries,
- generic account labels,
- representative markdown.

### Hermes Personal Hub World

Can preserve:

- public project name,
- public repo concepts,
- current design milestones,
- schema/validator/demo/renderer roadmap,
- Growth Log events from public commits.

Must remove or replace:

- local Codex thread IDs if not meant for public docs,
- private working paths,
- raw private conversation text,
- unpublished personal planning notes.

### Fitness World

Can preserve:

- training consistency as a status,
- weekly trend shape,
- tracker/workflow candidate status,
- review surface concept.

Must remove or replace:

- raw health metrics,
- body measurements,
- heart-rate records,
- exact workout logs if personal,
- medical or injury details.

Recommended public data:

```json
{
  "world": "Fitness",
  "status": "active",
  "metrics": [
    { "label": "training_consistency", "value": "steady" },
    { "label": "review_surface", "value": "candidate" }
  ],
  "trend": "synthetic"
}
```

### Finance World

Can preserve:

- review workflow shape,
- watchlist concept,
- digest entry point,
- protected status,
- confirmation boundary,
- candidate promotion model.

Must remove or replace:

- holdings,
- position sizes,
- account balances,
- brokerage names,
- transaction history,
- exact price targets,
- tax or identity details,
- anything that could imply real financial exposure.

Recommended public data:

```json
{
  "world": "Finance",
  "status": "protected_candidate",
  "summary": "A fictional review workflow for portfolio reflection.",
  "assets": [
    { "symbol": "DEMO-A", "role": "core_watch_item" },
    { "symbol": "DEMO-B", "role": "risk_review_item" }
  ]
}
```

### Digest And Automations

Can preserve:

- schedule shape,
- digest component type,
- automation status strip,
- output-to-display-growth pattern.

Must remove or replace:

- real digest text,
- private source names,
- local file paths,
- private task titles,
- raw automation logs.

Recommended public data:

```md
# Weekly Digest

This fictional digest shows how recurring outputs become visible Hub surfaces.

- Active world: Hermes Personal Hub
- Candidate upgrade: public demo exporter
- Background signal: automation outputs can become display growth
```

### Agent Growth

Can preserve:

- public design decisions,
- public commits,
- schema and visual policy events,
- Growth Log examples.

Must remove or replace:

- private prompts,
- raw assistant conversation,
- internal thread URLs unless intentionally documented,
- private preference text that was not meant for public release.

## Field-Level Handling

Suggested exporter behavior:

| Field | Public Handling |
|---|---|
| `id` | Preserve if not revealing private info. Otherwise replace with stable demo id. |
| `title` | Preserve public titles; rewrite private titles. |
| `summary` | Rewrite into public-safe abstract summary. |
| `source.refs` | Preserve public refs; replace private refs with demo refs. |
| `data.file` | Preserve relative structure; ensure target data is sanitized. |
| `why_here` | Rewrite if it mentions private behavior too specifically. |
| `user_value` | Preserve product-level value; remove private facts. |
| `promotion.reasons` | Preserve pattern-level reasons; remove private counts if sensitive. |
| `changes` | Preserve public design changes; rewrite private paths. |

## Exporter Responsibilities

A future `packages/exporter/` should:

1. Read a private Hub root.
2. Validate it with `packages/validator/`.
3. Copy approved structural files.
4. Apply deterministic replacements.
5. Rewrite sensitive summaries.
6. Write a public demo root.
7. Validate the public demo root.
8. Run leakage checks.
9. Produce an export report.

The exporter should not:

- publish automatically,
- commit automatically,
- infer that a leak scan is equivalent to human review,
- connect to live Hermes,
- read outside the provided private Hub root.

## Leakage Scan

Before committing a public demo snapshot, run checks for categories that indicate private or credential-bearing content:

- absolute local path prefixes,
- private vault or repo names,
- GitHub usernames when they identify private context,
- API key variable names,
- encryption secret variable names,
- private key block headers,
- vendor token prefixes,
- assignment-like key, secret, and token patterns.

This list should expand as the project learns.

## Validation Gate

A public demo snapshot is commit-ready only if:

- private Hub validates before export,
- public demo validates after export,
- leakage scan has no sensitive hits,
- human review confirms finance, fitness, digest, and automation data are demo-safe,
- `.local/` remains ignored,
- public files do not depend on local-only assets.

## Open Questions

- Should the first exporter be deterministic templates only, or allow an LLM rewrite step?
- Should public demo snapshots include fictional Chinese/English bilingual copy by default?
- Should finance and fitness demo data be generated from fixed fixtures or hand-authored?
- Should the exporter produce a machine-readable sanitization report?
