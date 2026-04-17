# 0001: Independent Iteration Before Hermes Integration

Status: Accepted  
Date: 2026-04-18

## Context

Hermes Personal Hub is designed to become a growing Life OS layer on top of Hermes Agent. It will eventually need to integrate with the official Hermes dashboard plugin system, and later may read real Hermes sessions, skills, memory, cron outputs, and plugin APIs.

The project is still defining its product model, trust boundary, schemas, visual system, private/public data split, and Host Plugin architecture. Integrating too early with a deployed Hermes environment would make the prototype depend on runtime details before the core model is stable.

The user also has an active Hermes environment. Early Personal Hub experiments must not affect that environment.

## Decision

Hermes Personal Hub will iterate as an independent open-source repository until it is stable enough to integrate with a deployed Hermes environment.

The project will not be installed into, deployed alongside, or connected to the user's live Hermes environment during the early design and prototype stages.

## Phases

### Phase 1: Independent Design And Prototype Repo

Current phase.

The repository may contain:

- design specs,
- visual policy,
- CSS primitives,
- schemas,
- validator,
- private working Hub state under `.local/`,
- public-safe demo snapshots,
- static renderers,
- local Host Plugin skeleton prototypes.

The repository should not:

- read from a live Hermes deployment,
- write to a live Hermes deployment,
- install a dashboard plugin into the user's active Hermes environment,
- require live Hermes credentials,
- depend on private runtime paths or accounts.

### Phase 2: Local Compatibility Adapter

After the schema, validator, private/public boundary, visual primitives, and demo renderer are stable, the project may add a local compatibility adapter.

This adapter may simulate the Hermes dashboard plugin boundary or use local fixture data shaped like Hermes plugin APIs. Its job is to test integration assumptions without touching a deployed environment.

Validation targets:

- Host Plugin can read a Hub manifest.
- Components can render from declared data bindings.
- Growth Log can display change records.
- Control actions such as pin, hide, and archive have a safe local model.
- Agent-generated state can be validated before use.

### Phase 3: Hermes Deployment Integration

Only after the previous phases are useful and stable should the project integrate with a deployed Hermes environment.

This phase may include:

- installing a `personal-hub` dashboard plugin,
- connecting to Hermes plugin APIs,
- reading real session, memory, skill, and cron data,
- enforcing permission and confirmation boundaries,
- adding rollback and migration tools,
- documenting deployment and removal procedures.

## Consequences

### Benefits

- The active Hermes environment stays safe while the project is immature.
- Product design can evolve without being constrained by early runtime assumptions.
- Schemas, validators, and public demo data can mature before live integration.
- The public repo remains useful to other contributors before they run Hermes locally.

### Trade-Offs

- Early prototypes may use fixture data rather than live Hermes state.
- Some integration risks will be discovered later.
- The project needs a clear promotion gate before deployment integration begins.

## Promotion Gate

The project can consider Phase 3 only after:

- Hub schemas and validator are stable enough for private and public Hub state.
- A public-safe demo snapshot exists and passes validation.
- A static or local renderer demonstrates the core Life OS experience.
- The Host Plugin skeleton can load manifest-driven components locally.
- Private data boundaries and leakage checks are documented.
- Deployment, rollback, and removal procedures are drafted.

Until then, Hermes Personal Hub remains an independent project.
