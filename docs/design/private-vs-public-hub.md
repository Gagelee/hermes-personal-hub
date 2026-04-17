# Private Working Hub And Public Demo Hub

Status: Draft  
Scope: Data boundary for using Hermes Personal Hub personally while developing a public open-source project.

## Purpose

Hermes Personal Hub needs to be useful before it can be demoed. The first working Hub should reflect the user's real Life OS: active projects, fitness, finance, digests, automations, and agent growth.

That working state is private by default. Public examples should be created later as sanitized snapshots.

## Rule

Private Hub is for living. Public Demo is for explaining.

## Private Working Hub

The private working Hub lives under:

```text
.local/personal-hub/
```

This directory is ignored by Git. It may contain real working context, private summaries, personal worlds, local paths, sensitive project details, and early experiments.

The private Hub is allowed to evolve quickly because it is not a public artifact.

## Public Demo Hub

The public demo Hub will live under:

```text
examples/personal-hub/
```

It should be derived from the private working Hub only after review and sanitization.

The demo may preserve structure and product truth, but it must not include:

- private file paths,
- private note contents,
- real account names,
- precise financial holdings or amounts,
- brokerage or payment details,
- health-sensitive raw metrics,
- secrets, tokens, keys, or local config,
- unpublished personal project details,
- raw automation outputs containing private content.

## Sanitization Strategy

When creating a public demo:

- Replace real finance data with fictional assets and rounded sample values.
- Replace health-sensitive metrics with synthetic trends.
- Replace private notes with short invented summaries.
- Replace local paths with repo-relative demo paths.
- Replace automation outputs with representative markdown.
- Preserve component shape, lifecycle status, Growth Log behavior, and visual primitives.

## Development Flow

1. Use `.local/personal-hub/` as the real working system.
2. Let schemas and validators support both private and public state.
3. Promote stable patterns from private state into public docs.
4. Export or hand-create sanitized snapshots into `examples/personal-hub/`.
5. Run leakage checks before committing public examples.

## Leakage Checks

Before committing any example data, scan for:

- absolute local paths,
- usernames,
- repo names that should remain private,
- API keys,
- token-like strings,
- secrets,
- account identifiers,
- finance account details,
- raw health records.

Public examples should be boringly safe.
