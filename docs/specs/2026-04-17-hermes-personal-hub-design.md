# Hermes Personal Hub Design

Status: Draft  
Date: 2026-04-17  
Scope: Product and architecture specification for a growing Life OS layer on top of Hermes Agent.

## Context

Hermes Agent already positions itself as a self-improving agent: it develops memory, skills, scheduled automations, and cross-session understanding. The current UI surfaces for agents, however, are usually fixed product interfaces. They do not evolve with the user in the same way the agent claims to evolve.

This spec defines **Hermes Personal Hub**: a Life OS growth layer that lets the UI become a durable surface for what the user and agent repeatedly do together.

The design is based on a quick source review of:

- `NousResearch/hermes-agent` at `6ea7386`
- `nesquena/hermes-webui` at `f3f23ab`

Key finding: official Hermes already includes a React/Vite dashboard and a dashboard plugin system. The community Web UI provides a rich chat workbench. Personal Hub should not reinvent either. It should define a growth layer above the official dashboard plugin runtime.

## Product Positioning

Hermes Personal Hub is a **Life OS growth layer** built on top of the official Hermes dashboard plugin system.

It is not a replacement for chat UI. Chat remains the conversational entrypoint. Personal Hub is where the agent turns repeated work, gathered information, created skills, scheduled digests, and small personal tools into durable visual and interactive surfaces.

The Hub should orient around the user's life, work, research, health, finance, projects, and long-term growth. Agent internals such as skills, sessions, memory, cron jobs, and tools are underlying capabilities. The user-facing surface should express what those capabilities mean in the user's world.

## User Value Model

### Felt Growth

The user should be able to feel that both the agent and the user are growing.

Personal Hub should make progress visible:

- What the user has recently been working on.
- Which repeated themes are becoming durable.
- Which conversations became skills, workflows, digests, components, or tools.
- What the agent has learned about the user's preferences and patterns.
- Which long-term worlds are accumulating structure.

This should be concrete and grounded, not generic praise.

Example tone:

> You returned to Hermes Personal Hub design across several sessions. The idea has moved from UI redesign into a policy and plugin architecture.

### Interaction Upgrade

Repeated language-only tasks should become functional interaction surfaces when UI reduces friction.

The path is:

```text
conversation -> repeated intent -> display surface -> interaction surface -> personal tool -> durable plugin
```

Examples:

- Repeated portfolio reviews become a portfolio cockpit.
- Repeated workout logging becomes a fitness tracker.
- Repeated research digests become a research board.
- Repeated project updates become a project cockpit.
- Repeated prompt or workflow usage becomes a prompt runner or small tool.

The Hub should become the default place to host small user-specific tools that do not deserve a separate app.

## Core Principles

### Policy Over Framework

Layout governance is not a frontend framework. It is a policy that the agent follows when generating or updating the Hub.

The frontend provides:

- Runtime rendering.
- Component containers.
- Manifest loading.
- Versioning.
- Undo and audit support.
- Safety boundaries.

The agent reads policy and decides how the Hub should grow.

### Life OS Orientation, Not Fixed Sections

`Now`, `Worlds`, `Knowledge`, `Capabilities`, `Growth`, and `Control` are semantic coordinates, not mandatory homepage sections.

Different users and different periods may emphasize different coordinates. The homepage can adapt, but must remain understandable, searchable, and recoverable.

### Automatic First, Reversible Always

The default posture is automatic growth. Agent-generated display surfaces and low-risk component updates should not require constant approval.

Every automatic change must provide:

- Source.
- Reason.
- Time.
- Impact scope.
- Change summary.
- Undo path.

High-risk actions still require explicit confirmation.

### User Reality Over Agent Internals

The Hub should not lead with internal system counts such as tools, sessions, or skills unless the user is explicitly managing the agent.

Prefer user-world phrasing:

- "Your Hermes UI spec is becoming an active project."
- "This digest now has enough history to become a field page."
- "This repeated review can become a checklist."

### Open Components, Personal Composition

Components can be open-source, installable, reusable, and shareable. Their final placement, visibility, priority, and data bindings are personal.

### Stable Enough To Trust, Adaptive Enough To Grow

The Hub may change automatically, but it cannot undermine user trust. User commitments are protected. Display surfaces can drift. Workflows must earn stability.

### Audit Is Part Of The Interface

Growth Log, Undo Center, permission records, and source attribution are core UI, not hidden settings.

## Official Dashboard Plugin Boundary

The official Hermes dashboard plugin system should be treated as the **installation and runtime extension boundary**, not as the smallest unit of everyday UI growth.

It is good for:

- Persistent independent capability modules.
- Dedicated frontend logic.
- Backend API routes.
- Versioned, reusable, open-source plugins.
- Features with their own state, permissions, and tests.

It is too heavy for:

- Recent-work cards.
- One-off digest views.
- Temporary project summaries.
- Emotional or reflective growth signals.
- Simple shortcut collections.
- Small layout changes.

Generating a full dashboard plugin requires manifest, JavaScript bundle, optional CSS, optional Python API, registration, permissions, security review, versioning, testing, and rollback. That cost is appropriate for durable functions, not for daily display growth.

## Personal Hub Host Plugin

Personal Hub should initially ship as one official dashboard plugin, tentatively named `personal-hub`.

This Host Plugin is installed once. After that, most growth happens inside it through manifests, data files, component instances, layout patches, and policies.

The daily growth unit should be:

```text
data update -> component instance -> layout patch
```

Standalone dashboard plugins should be rare, durable capability modules.

## Growth Tracks

Personal Hub has two growth tracks.

| Track | Unit | Effort | Default Mode | User Value |
|---|---|---:|---|---|
| Display Growth | Data + component instance | Low | Automatic | Felt Growth |
| Functional Growth | Interaction surface / tool / plugin | Medium to high | Staged | Interaction Upgrade |

### Display Growth

Display Growth is the daily growth path. It arranges existing information in useful, timely, emotionally grounded ways.

Examples:

- Recent user work.
- Recent session themes.
- Interaction guides.
- Daily or weekly digests.
- Automation outputs.
- Recently updated skills.
- Emerging patterns or interests.
- Continue-work shortcuts.
- Lightweight growth reflections.

Display Growth should use existing component templates and generated data. It should not require new JavaScript or backend APIs.

Sources include sessions, memory, skills, cron outputs, workspace files, digest markdown, and Hub interaction data.

### Functional Growth

Functional Growth upgrades repeated language interaction into UI interaction.

It should follow a staged path:

1. Pattern detected.
2. Display candidate.
3. Lightweight workspace or field page.
4. Interactive surface.
5. Host Plugin extension.
6. Standalone dashboard plugin proposal.
7. Pluginization.

Promotion criteria:

- Repetition across sessions.
- Persistence across days or weeks.
- Clear reduction in repeated prompting.
- Need for structured input, editing, calculation, approval, or execution.
- Need for independent data schema or state.
- Permission and safety implications.
- Reusability as an open component or plugin.
- Maintainability by the agent.

## Generation Levels

| Level | Name | Description | Default Permission |
|---:|---|---|---|
| 0 | Data Update | Update data for an existing component | Automatic |
| 1 | Component Instance | Add card, list, chart, timeline, or panel using existing templates | Automatic, reversible |
| 2 | Page Composition | Add or adjust a page or field composition | Automatic with Growth Log |
| 3 | Host Extension | Add a reusable component type inside Personal Hub Host Plugin | Reason required; may ask |
| 4 | Standalone Plugin | Generate a full official dashboard plugin | Confirmation required |
| 5 | Sensitive Integration | External account, secret, transaction, publish, dangerous read/write | Hard confirmation required |

## Adaptive Trust Policy

Adaptive UI must be governed by policy. The user should feel:

> This Hub grows, but it does not silently break what I rely on.

### Protected

Protected items cannot be automatically moved, hidden, deleted, or structurally rewritten.

Examples:

- Pinned components.
- User-created pages.
- User-named worlds.
- Long-term functional tools.
- Sensitive integrations.
- User-customized layout areas.

Allowed automatic actions:

- Data refresh.
- New or updated marker.
- Suggestion to improve.
- Staleness notice.

### Adaptive

Adaptive items can be automatically reordered, summarized, folded, or elevated if changes are logged and reversible.

Examples:

- Recent projects.
- Digest displays.
- Active world entries.
- Recent skills and workflows.
- Automation status.
- Recent learned preferences.

Rules:

- Avoid high-frequency main layout reshuffles.
- Enter automatic changes into Growth Log.
- Provide `why_here`.
- Deprioritize repeatedly hidden items.
- Fold or archive low-use content instead of deleting it.
- Keep homepage high-confidence and high-value.
- Let field pages evolve more freely than the homepage.

### Experimental

Experimental items are new interaction surfaces, new component types, new data schemas, or new workflows. They must be visibly marked as experimental.

Rules:

- Declare source and goal.
- Provide hide, archive, and delete paths.
- Do not replace protected tools.
- Do not silently take over workflows.
- Require usage before promotion.

### Ephemeral

Ephemeral items are short-lived cards, summaries, reminders, and temporary shortcuts.

Rules:

- Declare TTL or archive behavior.
- Avoid permanent navigation.
- Can change frequently.
- Must not cause major layout instability.

## Hard Trust Rules

The machine-readable policy should enforce:

- Pinned items cannot be moved, hidden, deleted, or structurally rewritten automatically.
- User-created pages cannot be deleted automatically.
- Standalone plugins cannot be generated, installed, removed, or upgraded without explicit confirmation.
- Sensitive integrations always require explicit confirmation.
- Homepage primary navigation cannot change more than once per 7 days without confirmation.
- A page cannot receive more than one automatic structural layout change within 24 hours.
- Every automatic layout change must create a change record.
- Components hidden or ignored 3 times should be deprioritized.
- Ephemeral components must declare expiry.
- Experimental components must declare promotion criteria.

## File Structure

Personal Hub uses Markdown for intent and YAML/JSON for execution.

```text
~/.hermes/personal-hub/
  HUB.md
  LAYOUT_POLICY.md
  hub.manifest.yaml
  policy.schema.yaml
  components/
    recent-work.yaml
    weekly-digest.yaml
    hermes-ui-project.yaml
  data/
    digests/
      2026-04-17-weekly-digest.md
    summaries/
      recent-interactions.json
    metrics/
      fitness-weekly.json
  pages/
    hermes-ui.yaml
    finance.yaml
    fitness.yaml
  changes/
    2026-04-17T23-40-12Z-layout-update.json
  archive/
    components/
    pages/
    data/
```

### `HUB.md`

Human-readable Life OS brief. Defines direction, tone, domains, preferences, automatic growth comfort, and areas requiring caution.

### `LAYOUT_POLICY.md`

Human-readable policy for how the agent generates layouts. It defines Protected, Adaptive, Experimental, and Ephemeral behavior.

### `hub.manifest.yaml`

Machine-readable current Hub state:

- Schema version.
- Homepage composition.
- Pages.
- Component instances.
- Pinned/protected/archive status.
- Data source references.
- Control settings.

### `components/*.yaml`

Component instances. These specify component type, data binding, placement, lifecycle, permissions, and `why_here`.

Example:

```yaml
id: weekly-digest
type: markdown_digest
status: ephemeral
title: Weekly Digest
source:
  kind: cron_output
  ref: data/digests/2026-04-17-weekly-digest.md
placement:
  preferred_surface: home
  semantic_zone: now
lifecycle:
  expires_at: "2026-04-24T00:00:00Z"
  on_expire: archive
explanation:
  why_here: "This digest summarizes recurring themes from the past week."
permissions:
  reads:
    - cron_outputs
  writes: []
```

### `pages/*.yaml`

Field pages, project pages, and tool surfaces. Pages define semantic purpose, component list, ordering rules, status, data sources, and whether automatic structure changes are allowed.

### `data/`

Generated or derived material for Display Growth:

- Markdown digests.
- JSON summaries.
- Time-series metrics.
- Link collections.
- Session clusters.
- Skill indexes.
- Automation summaries.
- Project snapshots.

### `changes/*.json`

Every automatic change must create a change record:

- Trigger.
- Reason.
- Risk level.
- Files changed.
- Before/after summary.
- Affected components.
- Rollback pointer.
- Whether it appears in Growth Log.

## Component Model

The Host Plugin should provide a small set of reusable components before adding complex custom code.

### Primitive Components

| Component | Purpose | Common Data |
|---|---|---|
| `markdown_panel` | Digest, guide, summary, note | Markdown |
| `metric_card` | Single metric or state | JSON |
| `timeline` | Recent events, growth log, automation results | JSON list |
| `link_board` | Shortcuts, resources, continue-work entrypoints | JSON list |
| `status_strip` | Horizontal multi-status summary | JSON |
| `entity_card` | Project, world, skill, automation, file summary | YAML/JSON |
| `table_view` | Structured records | JSON/CSV |
| `chart_view` | Series and trends | JSON series |
| `quote_or_note` | Specific emotional or reflective note | text/Markdown |
| `diff_summary` | Recent changes | JSON diff summary |
| `tag_cluster` | Themes, keywords, domains | JSON list |

### Composite Patterns

Composite patterns are recommended arrangements, not hardcoded business features.

| Pattern | Composition | Value |
|---|---|---|
| `recent_work_snapshot` | timeline + link_board + quote_or_note | Shows recent progress |
| `growth_signal` | diff_summary + entity_card + note | Makes growth visible |
| `digest_surface` | markdown_panel + link_board + status_strip | Turns digest into navigable surface |
| `world_card` | entity_card + metric_card + timeline | Represents an active life/work world |
| `skill_surface` | entity_card + markdown_panel + link_board | Makes skills usable |
| `automation_monitor` | status_strip + timeline + table_view | Shows automation health |
| `project_cockpit_light` | entity_card + timeline + link_board + markdown_panel | Lightweight project page |

### Interactive Components

Interactive components bridge Functional Growth without immediately creating standalone plugins.

| Component | Purpose |
|---|---|
| `action_button` | Trigger existing prompt, command, skill, or automation |
| `prompt_runner` | Run a prompt/workflow with parameters |
| `checklist` | Review or approval workflow |
| `form_panel` | Structured input |
| `kanban_light` | Simple task/project movement |
| `filterable_table` | Explore records |
| `annotation_panel` | User feedback on generated content |
| `approval_panel` | Accept/reject/later for proposals |

Interactive components may trigger Hermes capabilities, but should not hold complex business logic. Complex logic should promote to Host Extension or standalone plugin.

## Agent Generation Loop

The generation loop has 8 steps.

### 1. Observe

Collect signals from sessions, skills, memory, cron output, workspace files, user pins/hides/opens, and existing Hub usage.

### 2. Classify

Classify candidate growth:

- `display_update`
- `display_component`
- `page_composition`
- `interactive_surface`
- `host_extension_candidate`
- `standalone_plugin_candidate`
- `sensitive_action`

### 3. Score

Score by:

- Recency.
- Frequency.
- Durability.
- User value.
- Confidence.
- Risk.
- Effort.
- Layout pressure.
- Stability impact.

### 4. Decide

Decision rule:

```text
Low risk + low effort + high relevance -> auto
Medium risk or layout impact -> auto but log prominently
High risk or code/plugin generation -> ask
Sensitive integration -> hard confirm
```

### 5. Generate

Generate the smallest useful patch. Prefer data updates over layout changes, component instances over code, and candidates over workflow replacement.

### 6. Validate

Validate schema, references, component type, status, TTL, protected rules, permission declarations, homepage pressure, and change record completeness.

### 7. Apply And Log

Apply patch, update manifest, write change record, update Growth Log, provide `why_here`, and attach rollback pointer.

### 8. Learn

Adjust future generation based on user behavior:

- Pin increases weight.
- Hide decreases weight.
- Undo records negative feedback.
- Repeated use increases promotion likelihood.
- Ignored experiments get archived.

## Hard Confirmation Triggers

These require explicit confirmation:

- Install, upgrade, remove, or generate standalone dashboard plugin.
- External publish.
- Secret, auth, payment, or transaction configuration.
- External account connection.
- Private data exposure to external service.
- Delete protected page or component.
- Modify pinned layout.
- Create an automation that actively executes actions.
- Change safety policy.

## Proposal Model

When confirmation is needed, Agent should create a structured proposal instead of asking vaguely.

Example:

```yaml
id: portfolio-review-plugin-proposal
type: standalone_plugin_candidate
title: Portfolio Review Cockpit
reason: "Similar portfolio review workflows appeared 6 times in the past 14 days."
expected_value:
  - "Reduce repeated prompt setup."
  - "Show positions, risk, digest, and review checklist in one place."
cost:
  effort: high
  maintenance: medium
  permissions:
    - read finance notes
    - optionally connect broker data
risk:
  level: 4
  notes:
    - "External broker integration requires separate confirmation."
alternatives:
  - "Keep as display-only dashboard."
  - "Create lightweight prompt runner first."
recommended_next_step: "Create a Host Plugin interactive prototype, not standalone plugin yet."
```

## Visual And Art Direction Policy

Personal Hub needs a visual system, but the system should be a **generation policy**, not a fixed page template. The goal is to let Agent-generated pages feel coherent while still allowing personal adaptation.

The visual language should support two emotional qualities:

- **Life OS**: calm, durable, personal, useful, and lived-in.
- **Visible Growth**: the interface should make accumulation, continuity, and progress perceptible.

It should avoid looking like:

- A generic admin dashboard.
- A plugin marketplace.
- A chat app with extra tabs.
- A decorative AI landing page.
- A constantly reshuffled analytics board.

### Design Tokens Over Custom Styling

Generated components should use Host Plugin design tokens and approved component primitives. Agent-generated YAML should select component type, density, emphasis, semantic zone, and data binding. It should not invent arbitrary CSS for routine Display Growth.

Custom CSS should be allowed only for:

- Host Plugin theme work.
- New reusable component types.
- Standalone plugins.
- Highly specific visual artifacts that cannot be expressed through existing primitives.

### Visual Stability

The visual system should make adaptation visible without making the product feel unstable.

Rules:

- Protected components keep stable position, size class, and visual identity.
- Adaptive components may change ordering and emphasis, but should not constantly change visual form.
- Ephemeral components can be visually lighter and more fluid.
- Experimental components must look distinct enough that users do not confuse them with durable workflow tools.
- Growth Log entries should make changes legible without turning the homepage into an audit table.

### Component Emphasis Levels

Every component instance should declare an emphasis level:

```yaml
visual:
  emphasis: primary | secondary | quiet | ambient
  density: compact | normal | expanded
  motion: none | subtle
```

Meanings:

- `primary`: one or two highly relevant surfaces on the current page.
- `secondary`: useful but not dominant.
- `quiet`: supporting context.
- `ambient`: background growth signal or low-pressure emotional value.

The homepage should have a small number of primary surfaces. Too many primary components makes the Hub feel like a dashboard shouting at the user.

### Information Density

Personal Hub should support multiple density modes without fragmenting the design.

- `compact`: for status strips, quick links, recent signals.
- `normal`: default card and panel density.
- `expanded`: for digest reading, project review, research boards, and functional workflows.

Agent should prefer compact or normal density for automatic Display Growth. Expanded surfaces should usually live on field pages or be opened by user action.

### Growth Signals

Growth should be visible through small, concrete signals:

- "Updated from weekly digest."
- "Promoted from repeated sessions."
- "New skill-linked workflow."
- "Candidate for interaction surface."
- "Experimental tool, used 2 times."

These should be attached to components as provenance and lifecycle metadata, not as motivational decoration.

### Imagery And Material

The Hub should allow richer materials than plain text cards, especially for Life OS domains. Examples:

- Project covers.
- Digest thumbnails.
- Fitness charts.
- Finance sparklines.
- Research maps.
- Skill icons.
- Timeline markers.

However, generated imagery should serve recognition and memory. It should not become generic decoration.

Policy:

- Prefer meaningful domain images, charts, icons, diagrams, and artifacts.
- Avoid decorative backgrounds that do not encode information.
- Do not reuse the same generic image for unrelated worlds.
- Let users pin or override visual identity for important worlds.

### Tone And Copy

Personal Hub copy should be specific, calm, and grounded.

Good:

> You returned to Hermes Personal Hub design across multiple sessions. This is now an active world with a draft spec.

Bad:

> Amazing progress! Your productivity is skyrocketing!

Generated copy should:

- Reference concrete user activity.
- Avoid generic praise.
- Explain why a component exists.
- Offer useful next actions.
- Keep sensitive topics neutral.

### Art Direction As Policy File

The user-facing art direction should live in Markdown and machine-readable constraints:

```text
HUB.md
LAYOUT_POLICY.md
VISUAL_POLICY.md
visual.schema.yaml
```

`VISUAL_POLICY.md` records human preferences:

- Desired mood.
- Density preference.
- Color and motion comfort.
- How emotional the Hub should be.
- Which domains should feel more serious or more playful.
- Which visual patterns the user dislikes.

`visual.schema.yaml` records enforceable rules:

- Allowed component types.
- Allowed emphasis levels.
- Allowed density levels.
- Motion limits.
- Theme token usage.
- Whether custom CSS is allowed.

### Visual Policy Summary

The visual system should be:

```text
coherent by tokens
personal by composition
adaptive by policy
trustworthy by provenance
alive through concrete growth signals
```

## MVP Scope

The MVP should prove that Personal Hub can grow through low-cost display generation before attempting full functional plugin generation.

The first version should not try to build every Life OS surface. It should validate the core loop:

```text
agent observes activity -> writes data/component/manifest patch -> Host Plugin renders it -> user can inspect, hide, pin, or undo
```

### MVP Goals

The MVP should demonstrate:

- A Personal Hub Host Plugin can run inside the official Hermes dashboard plugin system.
- The Hub can render component instances from YAML/JSON/Markdown files.
- Agent-generated display growth can happen without writing new frontend code.
- Every generated component has provenance, lifecycle, and `why_here`.
- Users can pin, hide, archive, and inspect generated surfaces.
- Growth Log makes automatic changes legible.
- Basic validation prevents malformed or unsafe Hub state.

### MVP Non-Goals

The MVP should not include:

- Automatic generation of standalone dashboard plugins.
- External account integrations.
- Sensitive data connectors.
- Complex workflow execution.
- A full visual design system.
- Multi-user collaboration.
- Marketplace or community component registry.
- Advanced rollback engine beyond file-level change records.

These are important later, but they would hide the central question: can the Hub grow cheaply and safely through policy-driven display surfaces?

### MVP User Experience

The first usable experience should have four stable views:

1. **Home**
   - Shows adaptive display components.
   - Starts with recent work, digest surface, active worlds, and growth signals.

2. **Worlds**
   - Shows generated field pages such as Hermes UI, Finance, Fitness, Research, or Projects.
   - Pages are created from `pages/*.yaml`.

3. **Growth Log**
   - Shows what the agent generated, updated, archived, or proposed.
   - Every entry links to source, reason, affected files, and undo information.

4. **Control**
   - Shows pinned items, hidden items, policy settings, and safety status.
   - Lets the user tune automatic growth comfort.

### MVP Component Set

The first component set should be intentionally small:

- `markdown_panel`
- `entity_card`
- `timeline`
- `link_board`
- `metric_card`
- `status_strip`
- `table_view`
- `diff_summary`
- `growth_signal`
- `prompt_runner_stub`

`prompt_runner_stub` is intentionally a stub in MVP. It can display an intended prompt/workflow and a disabled or logged action path, but should not execute arbitrary tasks until the permission model is designed.

### MVP Data Sources

Initial data sources should be file-based:

- Manually or agent-generated markdown digests.
- JSON summaries.
- YAML component instances.
- Static sample session clusters.
- Static skill summaries.
- Static automation summaries.

The MVP may include importer scripts later, but the first runtime should be able to render from checked-in sample data. This makes the project easy to demo and safe to open source.

### MVP Example Worlds

The first three example worlds should be:

1. **Hermes Personal Hub**
   - This project itself becomes the first active world.
   - Demonstrates Felt Growth from concept to spec to runtime.

2. **Digest Center**
   - Demonstrates low-cost display growth from recurring digest files.
   - Shows markdown panels, timelines, and link boards.

3. **Skill Studio Light**
   - Demonstrates skills becoming usable surfaces.
   - Shows skill cards, linked docs, and prompt runner stubs.

These examples avoid sensitive domains and make the open-source repo easier to evaluate.

## Runtime Architecture

Personal Hub should be a file-backed Host Plugin running inside the official Hermes dashboard plugin system.

### Layers

```text
Hermes Dashboard
  -> dashboard plugin loader
    -> Personal Hub Host Plugin
      -> manifest reader
      -> schema validator
      -> component renderer
      -> growth log viewer
      -> control surface
      -> optional plugin API

Hermes Agent / Codex / Claude
  -> reads HUB.md / LAYOUT_POLICY.md / VISUAL_POLICY.md
  -> observes sessions, skills, cron, files, memory
  -> writes data, component instances, page manifests, change records
  -> validates before applying
```

### Host Plugin Responsibilities

The Host Plugin should:

- Discover the Hub directory.
- Load `hub.manifest.yaml`.
- Load pages from `pages/*.yaml`.
- Load component instances from `components/*.yaml`.
- Load data from `data/`.
- Validate references and schema versions.
- Render known component types.
- Show provenance and lifecycle metadata.
- Provide pin, hide, archive, and inspect controls.
- Render Growth Log from `changes/*.json`.
- Refuse unsafe or malformed state.

The Host Plugin should not:

- Decide what the user's Life OS should contain.
- Generate new components by itself.
- Make external calls without explicit integration.
- Execute arbitrary prompts or commands in MVP.
- Silently repair policy violations.

### Agent Writer Responsibilities

The agent writes Hub state. It should:

- Read `HUB.md`, `LAYOUT_POLICY.md`, `VISUAL_POLICY.md`, and schemas.
- Classify candidate growth.
- Prefer Display Growth when possible.
- Generate minimal patches.
- Write data files before component instances.
- Write component instances before manifest placement.
- Write change records for every automatic update.
- Validate before declaring success.

### Validator Responsibilities

Validation should run both in agent workflow and Host Plugin runtime.

Validator checks:

- YAML and JSON parse.
- Required fields exist.
- Component IDs are unique.
- Component types are registered.
- Referenced files exist.
- Status values are legal.
- TTL is present for ephemeral components.
- Promotion criteria exist for experimental components.
- Protected/pinned rules are not violated.
- Permissions are declared.
- No absolute local paths are exposed in public/demo mode.

MVP can start with a lightweight script or library, but the contract should be strict enough that generated UI cannot become arbitrary unreviewed code.

### Renderer Responsibilities

The renderer maps component instances to approved React components.

Example:

```yaml
id: recent-project-snapshot
type: entity_card
title: Hermes Personal Hub
data:
  file: data/projects/hermes-personal-hub.json
visual:
  emphasis: primary
  density: normal
```

The renderer should not execute code from component YAML. It should interpret declarative data only.

### Data Flow

```text
1. Agent observes source activity.
2. Agent generates or updates data file.
3. Agent creates/updates component YAML.
4. Agent patches page or hub manifest.
5. Agent writes change record.
6. Validator checks the full resulting state.
7. Host Plugin reloads or refreshes.
8. User sees component with provenance and controls.
9. User pin/hide/archive actions update local Hub state.
10. Future agent generation learns from those actions.
```

### Storage Location

For a real Hermes installation, the default storage should be:

```text
~/.hermes/personal-hub/
```

For this open-source repo, sample/demo state should live under:

```text
examples/personal-hub/
```

This separation prevents public demo data from being confused with a user's private Hub.

### API Shape

The Host Plugin API can be small:

```text
GET  /api/plugins/personal-hub/state
GET  /api/plugins/personal-hub/component/{id}
POST /api/plugins/personal-hub/actions/pin
POST /api/plugins/personal-hub/actions/hide
POST /api/plugins/personal-hub/actions/archive
GET  /api/plugins/personal-hub/growth-log
POST /api/plugins/personal-hub/validate
```

MVP can load static files directly in demo mode, but a real Hermes plugin should expose API routes so state can be validated and mutated safely.

### Security Boundary

The Host Plugin must treat Hub files as untrusted generated content.

Rules:

- Do not execute generated JavaScript.
- Do not inject raw HTML from generated files.
- Render Markdown through a sanitizer.
- Restrict component types to a registry.
- Restrict actions to known verbs.
- Keep external integrations out of MVP.
- Keep secret values out of manifests and sample data.
- Require explicit confirmation for standalone plugin generation.

### Open-Source Repo Shape

The public repo should evolve toward:

```text
README.md
LICENSE
docs/
  specs/
  decisions/
  diagrams/
examples/
  personal-hub/
    HUB.md
    LAYOUT_POLICY.md
    VISUAL_POLICY.md
    hub.manifest.yaml
    components/
    data/
    pages/
    changes/
packages/
  host-plugin/
  schemas/
  validator/
```

The MVP can start with docs and examples before adding `packages/`.

## Open Questions

- Should Personal Hub initially live only in official Hermes dashboard, or also provide an adapter for the community Web UI?
- Where should Hub usage telemetry live?
- How should rollback patches be stored and applied?
- How much of Growth Log should be shown on the homepage versus Control surface?
- Should `prompt_runner_stub` remain display-only in MVP, or support confirmed local actions?

## Next Sections To Draft

- Schema definitions.
- Open-source component packaging model.
- Testing and review strategy.
