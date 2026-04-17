# Visual Policy

Status: Draft  
Scope: Visual generation policy for Hermes Personal Hub pages, components, examples, and future Host Plugin UI.

## Purpose

Hermes Personal Hub should feel like a personal operating surface, not a generic SaaS dashboard. The visual system should help users trust agent-generated growth by making structure, provenance, status, and change visible.

This policy guides both human design work and agent-generated UI. It should be read with:

- `docs/design/visual-reference-notes.md`
- `docs/design/visual.policy.yaml`
- `examples/personal-hub/tokens.css`
- `examples/personal-hub/primitives.css`

## North Star

Tactical precision meets minimalist editorial Life OS.

The interface should feel precise enough for serious work and calm enough for personal reflection. It should look like an instrument for organizing a person's active worlds, not like an AI product shell trying to look magical.

## Design Principles

### Life OS Before Dashboard

The Hub should organize the user's worlds, patterns, artifacts, and tools. It should not foreground agent internals unless the user is explicitly managing the agent.

Prefer:

- "Hermes Personal Hub is becoming an active project."
- "This digest has enough history to become a field page."
- "This workflow is ready for a prompt runner."

Avoid:

- "12 skills, 8 sessions, 5 tools."
- Generic analytics panels with no user-world meaning.
- Decorative AI spectacle.

### Precision Without Hostility

Use square geometry, clear alignment, edge markers, technical stamps, and sparse accent color. Keep the tactical tone, but avoid making the product feel militarized, cold, or punitive.

Good surfaces feel:

- exact,
- legible,
- auditable,
- calm,
- structured,
- personal.

### Provenance Is Visual

Agent-generated UI must show where it came from and why it is present. Source, lifecycle, confidence, and `why_here` should be visible patterns, not hidden metadata.

Every generated display component should have room for at least one provenance cue:

- source label,
- timestamp,
- status stamp,
- lifecycle marker,
- `why_here` disclosure,
- Growth Log link.

### Growth Signals Stay Concrete

Growth feedback should be factual and grounded. It should show what changed, what became more reusable, or what pattern emerged.

Prefer:

- "This topic appeared in 4 sessions over 7 days."
- "A display card was promoted into a workspace candidate."
- "This automation produced 5 consecutive digests."

Avoid:

- Confetti-like praise.
- Vague motivation.
- Game mechanics that compete with the user's real goals.

### Bilingual UI Is A Layout Pattern

Chinese and English labels should be paired intentionally. Chinese should not look like an afterthought or a translation dump.

Use:

- short English command labels with smaller Chinese context,
- aligned baselines,
- monospace metadata separated from human-facing text,
- consistent order within a surface.

### Display Can Drift, Workflows Earn Stability

Display Growth components may be visually flexible and adaptive. Functional Growth surfaces need stronger stability, clearer controls, and more conservative layout changes.

Visual language should make this distinction visible:

- ephemeral cards can be lighter and time-bound,
- adaptive cards can show source and movement reasons,
- experimental tools need explicit status markers,
- protected workflows need stable placement and stronger control affordances.

## Color Policy

Use a high-contrast light foundation by default.

Accent colors are semantic, not decorative:

- Blue: primary action, active focus, selected system state.
- Green: verified, healthy, successful, safe.
- Orange: monitoring, caution, active tracking, pending review.
- Red: destructive, blocked, sensitive, high risk.

Avoid large decorative gradients, purple-blue glow themes, beige editorial themes, dark slate dominance, and one-note palettes.

## Geometry Policy

Prefer:

- square corners,
- minimal radius,
- thin rules,
- edge markers,
- corner brackets,
- grid alignment,
- stable component dimensions.

Avoid:

- soft rounded consumer-app card stacks,
- cards inside cards,
- heavy shadows,
- decorative blobs,
- floating glass panels without functional meaning.

## Typography Policy

Use two roles:

- Geometric sans for human-facing headings, body copy, and navigation.
- Monospace for labels, timestamps, identifiers, metrics, status, and command-like controls.

Do not use negative letter spacing. Do not scale font size directly with viewport width. Text must fit its container on mobile and desktop.

## Component Policy

Generated components should use primitives before inventing new visuals:

- display surface,
- status strip,
- technical stamp,
- provenance chip,
- edge marker,
- corner bracket,
- growth marker,
- bilingual label,
- rectangular button,
- table/list/chart shell.

New visual variants must be justified by a new semantic role, not by novelty.

## Asset Policy

Local reference assets can inform design direction, but public repo assets must be open-source safe.

Do not copy from local references:

- raw HTML,
- screenshots,
- remote image URLs,
- placeholder credentials,
- private paths,
- generated mockup files.

Do create reusable primitives:

- design tokens,
- CSS utilities,
- component shell classes,
- semantic status markers,
- provenance patterns,
- layout rhythm examples.

## Interaction Policy

Controls should feel precise and reversible.

Default interaction cues:

- rectangular buttons,
- visible focus states,
- clear destructive states,
- status changes that do not resize the layout,
- small but legible command labels,
- undo and Growth Log affordances near generated changes.

Interactive components should make risk visible before action. Sensitive or irreversible actions require explicit confirmation outside the display primitive layer.

## Generated UI Rules

Agent-generated Display Growth must:

- use approved component types,
- avoid raw HTML,
- include source/provenance,
- declare lifecycle status,
- avoid creating permanent navigation for ephemeral items,
- preserve protected layout areas,
- use existing CSS primitives before adding styles.

Agent-generated Functional Growth must:

- show experimental or candidate status until promoted,
- expose its trigger and expected value,
- keep user controls stable,
- avoid silently replacing existing workflows,
- declare permission and state requirements.

## Open Questions

- Should the first public demo stay light-only, or include a restrained dark mode?
- Which primitives should become React components first?
- How much bilingual UI should be default versus user policy?
- Should visual policy validation run as part of schema validation?
