# Hermes Personal Hub

Hermes Personal Hub is a product and architecture proposal for a growing Life OS layer on top of Hermes Agent.

The core idea: if an agent can learn from a user over time, its interface should be able to grow with that user too. The Hub turns repeated conversations, skills, digests, memories, and small personal tools into durable visual and interactive surfaces.

## Current Status

This repository currently contains the initial design specification:

- [Hermes Personal Hub Design](docs/specs/2026-04-17-hermes-personal-hub-design.md)
- [Growth Protocol](docs/specs/2026-04-19-growth-protocol.md)
- [Core Runtime Roadmap](docs/specs/2026-04-19-core-runtime-roadmap.md)
- [Visual Reference Notes](docs/design/visual-reference-notes.md)
- [Visual Policy](docs/design/VISUAL_POLICY.md)
- [Machine-Readable Visual Policy](docs/design/visual.policy.yaml)
- [Private/Public Hub Boundary](docs/design/private-vs-public-hub.md)
- [Public Demo Export Design](docs/design/public-demo-export.md)
- [Example CSS Theme Entry](examples/personal-hub/theme.css)
- [Example CSS Tokens](examples/personal-hub/tokens.css)
- [Example CSS Primitives](examples/personal-hub/primitives.css)
- [Public Demo Hub Manifest](examples/personal-hub/hub.manifest.yaml)
- [Static Public Demo](examples/personal-hub/index.html)
- [Demo Growth Signal](examples/personal-hub/growth/demo-growth-protocol-signal.yaml)

The specs currently cover product positioning, user value, dashboard plugin boundaries, growth tracks, adaptive trust policy, growth protocol, core runtime roadmap, manifest structure, component model, agent generation loop, visual policy, MVP scope, and Host Plugin runtime architecture.

The repository also includes a sanitized public demo Hub under `examples/personal-hub/`.

## Design Direction

Personal Hub is not meant to replace chat. Chat remains the conversational entrypoint. The Hub is the place where useful patterns become visible and reusable.

The design centers on:

- **Felt Growth**: users can see that both they and their agent are accumulating structure, memory, and capability.
- **Interaction Upgrade**: repeated language-only workflows can become forms, dashboards, trackers, prompt runners, review flows, and small personal tools.
- **Policy over Framework**: layout governance should be an agent-readable policy, not a rigid frontend template.
- **Automatic First, Reversible Always**: low-risk display growth can happen automatically, while every change remains auditable and reversible.
- **Reusable Visual Primitives**: generated UI should reuse open-source-safe tokens and primitives instead of copying private reference assets or inventing one-off styles.

## Relationship To Hermes

This project is designed to build on the official Hermes dashboard plugin system rather than replace it.

The proposed architecture uses a durable **Personal Hub Host Plugin** as the runtime substrate. Most day-to-day growth happens through data updates, component instances, manifest patches, and layout policy. Full standalone dashboard plugins are reserved for durable, higher-effort functional modules.

Hermes Personal Hub is currently iterating as an independent repository. It should not be installed into or connected to a deployed Hermes environment until its schemas, validator, private/public data boundary, demo snapshot, renderer, and Host Plugin skeleton are stable enough to integrate safely.

See [Decision 0001](docs/decisions/0001-independent-iteration-before-hermes-integration.md).

## Validation

Run the validator tests:

```bash
npm test
```

Validate the ignored private working Hub:

```bash
npm run validate:private
```

Public demo Hubs should pass the same validator before commit.

Render the static public demo:

```bash
npm run render:demo
```

Preview a demo layout patch without writing files:

```bash
npm run dry-run:demo
```

## Planned Repo Shape

```text
docs/
  specs/
  decisions/
  diagrams/
examples/
  personal-hub/
    hub.manifest.yaml
    pages/
    components/
    data/
    changes/
    theme.css
    tokens.css
    primitives.css
packages/
  host-plugin/
  patch-engine/
  schemas/
  validator/
```

The next milestone is Undo Engine v0 for reversing low-risk applied patches before proposal review, Host Runtime work, or renewed UI composition.

## License

MIT
