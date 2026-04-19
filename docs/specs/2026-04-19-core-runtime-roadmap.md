# Hermes Personal Hub Core Runtime Roadmap

Status: Active  
Date: 2026-04-19  
Scope: What has been built, why the project is currently prioritizing runtime foundations over UI polish, and what should happen next.

## Context

Hermes Personal Hub started with a public demo and renderer to prove that a Hub state tree can become a visible page. That demo succeeded as a pipeline check, but it also exposed the wrong product center of gravity: the page currently feels like a flat clipboard because the renderer maps schema sections directly into cards.

The project should not spend the next phase polishing that static demo. The core product is a self-iterating agent-era home surface. That means the next priority is the runtime loop that can propose, preview, apply, audit, and undo Hub growth safely.

The UI should return after the runtime has enough real state transitions to design around.

## Current Decision

Continue the project, but shift the main iteration line from static demo presentation to Core Growth Runtime.

Do not prioritize:

- making the static renderer prettier,
- adding more public demo data,
- masking internal schema vocabulary in the generated HTML,
- building a final Life OS composition before the runtime is real.

Prioritize:

- Growth Protocol execution,
- patch dry-run,
- patch apply,
- undo,
- growth/change audit trail,
- proposal review,
- host runtime boundaries.

## What Exists Now

### Product and Design Specs

- `docs/specs/2026-04-17-hermes-personal-hub-design.md`
- `docs/specs/2026-04-19-growth-protocol.md`
- `docs/decisions/0001-independent-iteration-before-hermes-integration.md`
- visual and public/private boundary docs under `docs/design/`

These documents define the product direction, Growth Protocol, visual policy, private/public data boundary, and the decision to iterate independently before Hermes deployment.

### Public Demo Hub

The sanitized public demo lives under `examples/personal-hub/`.

It includes:

- `hub.manifest.yaml`
- page definitions under `pages/`
- component definitions under `components/`
- demo data under `data/`
- change records under `changes/`
- Growth Protocol examples under `growth/`, `proposals/`, `patches/`, and `undo/`
- static rendered HTML at `examples/personal-hub/index.html`

The demo is useful as a fixture and public-safe reference state. It is not the final product experience.

### Validator

The validator loads and checks Hub state trees.

Current responsibilities:

- validate manifest, page, component, change, growth signal, proposal, patch, and undo record schemas,
- check manifest-to-component references,
- check page-to-component references,
- check component data file references,
- validate both public demo and ignored private Hub state.

Commands:

```bash
npm test
npm run validate:demo
npm run validate:private
```

### Static Renderer

The renderer can generate a static public demo page:

```bash
npm run render:demo
```

Known limitation: it is schema-shaped rather than experience-shaped. It proves the data path, but it should not be treated as the final Life OS UI.

### Patch Dry-Run Engine

The dry-run engine reads a layout patch and reports what would happen without writing files.

Files:

- `packages/patch-engine/src/dryRunPatch.js`
- `packages/patch-engine/src/cli.js`
- `packages/patch-engine/test/dryRunPatch.test.js`

Command:

```bash
npm run dry-run:demo
```

Current behavior:

- reports patch id and risk level,
- reports planned operations,
- checks referenced components,
- checks referenced home sections,
- detects existing change records,
- reports rollback strategy,
- returns passed or failed status.

This is the first safe execution boundary: the agent can explain a patch before applying it.

### Patch Apply Engine

The apply engine applies low-risk patches only after dry-run passes.

Files:

- `packages/patch-engine/src/applyPatch.js`
- `packages/patch-engine/src/applyCli.js`
- `packages/patch-engine/test/applyPatch.test.js`

Usage:

```bash
node packages/patch-engine/src/applyCli.js <hub-root> <patch-path>
```

Current behavior:

- refuses to apply if dry-run fails,
- refuses to apply when risk level exceeds the default maximum,
- supports `add_component`,
- supports `create_change_record`,
- writes a growth/change record,
- refuses to overwrite an existing change record,
- validates through tests that applied fixture Hubs remain valid.

There is intentionally no `npm run apply:demo` shortcut yet. Applying patches writes files, so it should remain explicit until review and undo flows are stronger.

## Current Runtime Shape

```text
growth signal
  -> proposal
  -> layout patch
  -> dry-run report
  -> low-risk apply
  -> change record
  -> future undo
```

This is still not a full autonomous loop. It is the beginning of a controlled growth runtime.

The important shift is that the Hub now has executable semantics, not only documents and rendered cards.

## Known Product Gap

The generated public demo currently has these problems:

- the renderer maps manifest sections directly to visual card grids,
- generic object rendering exposes debug-like data,
- internal vocabulary such as `adaptive`, `why_here`, and synthetic demo labels leaks into the interface,
- visual primitives exist but are not composed into a higher-order Life OS layout,
- aesthetics and assets are not close enough to the intended reference direction.

These are real issues, but they should wait until the runtime path can generate meaningful states worth designing around.

## Roadmap

### Phase 1: State Contract and Validation

Status: Done.

Exit criteria:

- public demo Hub exists,
- private ignored Hub can be validated,
- schemas cover core Hub objects,
- validation catches schema and reference errors.

### Phase 2: Patch Dry-Run

Status: Done.

Exit criteria:

- a patch can be read from Hub state,
- supported operations can be summarized,
- missing references are reported,
- no files are written,
- CLI output is human-readable.

### Phase 3: Patch Apply

Status: Done for v0.

Exit criteria:

- apply requires dry-run success,
- low-risk default is enforced,
- supported operations write expected files,
- change records are created,
- existing change records are not overwritten,
- tests validate the resulting Hub.

### Phase 4: Undo Engine

Status: Next.

Goal: make applied growth reversible.

Expected behavior:

- read rollback operations from patch or undo record,
- support removing an added component from a home section,
- support removing a created change record,
- refuse unsafe or unsupported rollback operations,
- write or validate an undo/audit record,
- keep the Hub valid after undo.

Exit criteria:

- a fixture patch can be applied and then undone,
- undo refuses missing or already-mutated state when safety cannot be proven,
- tests cover successful undo and rejected undo.

### Phase 5: Proposal Review

Status: Planned.

Goal: introduce a review surface between Growth Protocol proposals and apply.

Expected behavior:

- list pending growth proposals,
- show linked dry-run report,
- distinguish auto-eligible, review-required, and blocked changes,
- allow accept/reject/defer decisions,
- record decision outcome.

Exit criteria:

- proposals can be reviewed without reading raw YAML,
- apply only happens through explicit acceptance or low-risk policy,
- rejected proposals leave an audit trail.

### Phase 6: Host Runtime Skeleton

Status: Planned.

Goal: define the Personal Hub Host Plugin boundary without depending on deployed Hermes yet.

Expected behavior:

- load Hub state through the same validator,
- expose runtime services for dry-run, apply, undo, and review,
- keep private/public export boundaries explicit,
- avoid direct coupling to the current static renderer.

Exit criteria:

- the host can run against local fixture/private Hub state,
- runtime actions are testable outside Hermes deployment,
- integration assumptions are documented before deployment.

### Phase 7: Experience-Shaped Renderer

Status: Planned after runtime foundations.

Goal: replace the schema-shaped demo renderer with a designed Life OS composition.

Expected behavior:

- command header,
- world/project rail,
- primary active focus panel,
- digest strip,
- growth/review surface,
- control/audit footer,
- user-facing language over internal schema fields,
- visual primitives and assets aligned with the intended aesthetic direction.

Exit criteria:

- UI no longer feels like a clipboard,
- protected workflows such as finance are presented as designed surfaces rather than raw object dumps,
- internal metadata remains available as provenance but does not dominate the interface,
- reference UI assets and visual policy are reconciled.

## Integration Boundary

This repository is currently an independent iteration space.

Do not connect it to a deployed Hermes environment until:

- runtime actions are reversible,
- private/public data boundaries are enforced,
- proposal review exists,
- host runtime assumptions are documented,
- demo and private Hub validation are stable,
- the UI has moved from schema-shaped rendering to experience-shaped composition.

The independent repo should remain the place where schemas, runtime semantics, and public-safe examples mature before deployment.

## Working Principles

- Prefer small, reversible growth over large generated changes.
- Dry-run before apply.
- Apply only when risk is low or review has happened.
- Write audit records for state changes.
- Keep UI polish behind runtime correctness.
- Keep private data out of public demo exports.
- Keep the repo usable without live Hermes integration.

## Immediate Next Step

Build Undo Engine v0.

Recommended implementation order:

1. Write tests for apply then undo on a copied fixture Hub.
2. Implement rollback operation support for `remove_component`.
3. Implement rollback operation support for `remove_change_record`.
4. Refuse unsupported rollback operations.
5. Validate the Hub after undo.
6. Add a CLI for explicit undo.

Undo should be completed before adding proposal review or returning to UI composition.
