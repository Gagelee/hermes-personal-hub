# Hermes Personal Hub Growth Protocol

Status: Draft  
Date: 2026-04-19  
Scope: Protocol for how an agent observes, decides, proposes, applies, audits, and promotes Personal Hub growth.

## Purpose

Hermes Personal Hub is not just a dashboard. It is a framework for letting an agent grow a user's home surface over time.

This protocol defines the missing core: how an agent decides that something from conversation, memory, skills, automations, files, or user behavior should become visible, interactive, stable, or archived in the Hub.

The protocol is upstream of UI. Renderers and Host Plugins should implement this protocol rather than inventing growth behavior inside presentation code.

## Non-Goals

This document does not define:

- final visual layout,
- Host Plugin implementation,
- live Hermes integration,
- public demo export mechanics,
- component rendering details,
- external account integrations.

Those depend on the growth protocol, not the other way around.

## Core Loop

The Hub grows through a repeatable loop:

```text
observe -> extract signal -> classify -> score -> decide -> propose/apply -> validate -> audit -> learn
```

Each step has a distinct responsibility.

| Step | Responsibility |
|---|---|
| Observe | Read allowed sources without changing Hub state. |
| Extract Signal | Convert raw activity into structured growth candidates. |
| Classify | Decide whether the candidate is display, functional, control, or sensitive. |
| Score | Estimate value, confidence, effort, risk, and stability impact. |
| Decide | Choose skip, update, create, patch, propose, or block. |
| Propose / Apply | Either write a proposal or apply a validated patch. |
| Validate | Check schemas, policy, references, permissions, and protected boundaries. |
| Audit | Write Growth Log, change record, and rollback pointer. |
| Learn | Update weights based on user pin/hide/open/undo/reject behavior. |

The loop should prefer the smallest useful change.

## Input Sources

The protocol may observe these source categories when allowed:

- recent conversations,
- session summaries,
- memory updates,
- skill files,
- automation outputs,
- digest markdown,
- workspace files,
- user-pinned or hidden Hub components,
- component open/click/run behavior,
- explicit user instructions,
- previous Growth Log and proposal outcomes.

The protocol must not assume access to live Hermes runtime during the independent repo phase. Fixture data, private working Hub files, or future local adapters may stand in for live sources.

## Growth Signal

A **Growth Signal** is a structured observation that may justify changing the Hub.

It is not yet a UI change.

Example:

```yaml
id: signal-hermes-protocol-2026-04-19
kind: repeated_project_focus
source:
  type: session_cluster
  refs:
    - private-session-summary
observed_at: "2026-04-19T00:00:00+08:00"
summary: "The user repeatedly returned to Personal Hub architecture and clarified that protocol matters more than demo polish."
evidence:
  - "User redirected from visual demo polish to core iteration framework."
  - "User emphasized self-iterating agent homepage as the core."
candidate_world: hermes-personal-hub
suggested_track: functional_growth
confidence: 0.86
privacy: private
```

### Signal Types

Initial signal types:

| Type | Meaning |
|---|---|
| `recent_work` | User recently advanced a project, workflow, or artifact. |
| `repeated_project_focus` | A topic or project repeats across sessions. |
| `digest_available` | A recurring digest or automation output exists. |
| `skill_created_or_updated` | A skill became available or changed. |
| `workflow_repetition` | User repeatedly asks for similar language workflow. |
| `interaction_friction` | A task requires repeated prompting or structured input. |
| `stale_surface` | A visible component no longer has recent value. |
| `user_pin` | User explicitly stabilized a component or world. |
| `user_hide` | User rejected or downranked a component. |
| `undo_event` | User rolled back an automatic change. |
| `sensitive_boundary` | Candidate touches finance, health, credentials, accounts, publishing, transactions, or destructive writes. |

## Classification

Each signal should classify into one primary growth class.

| Class | Description | Default Handling |
|---|---|---|
| `display_update` | Refresh data for an existing component. | Auto if low risk. |
| `display_component` | Add a new display component using existing templates. | Auto if low risk and reversible. |
| `page_composition` | Add or adjust a page, world, or surface composition. | Auto only when low impact; always log. |
| `interactive_surface_candidate` | Repeated language workflow may deserve structured UI. | Proposal or candidate component. |
| `host_extension_candidate` | Existing component templates are insufficient. | Proposal required. |
| `standalone_plugin_candidate` | Durable module may need its own plugin/API/state. | Confirmation required. |
| `sensitive_action` | Candidate may affect accounts, secrets, publishing, transactions, or dangerous writes. | Hard confirmation or block. |
| `control_feedback` | User pin/hide/archive/undo behavior updates policy weights. | Auto log and learn. |

## Scoring Model

The agent should score candidates before deciding.

Scores should be explicit, inspectable, and logged for non-trivial changes.

| Score | Range | Meaning |
|---|---:|---|
| `user_value` | 0-1 | Expected value for Felt Growth or Interaction Upgrade. |
| `confidence` | 0-1 | Confidence that the signal is real and correctly interpreted. |
| `recency` | 0-1 | How timely the signal is. |
| `frequency` | 0-1 | How often the pattern appears. |
| `durability` | 0-1 | Whether it should persist beyond the moment. |
| `effort` | 0-1 | Estimated implementation cost. Higher means more expensive. |
| `risk` | 0-1 | Privacy, safety, permission, or trust risk. |
| `layout_pressure` | 0-1 | How much the target surface is already crowded. |
| `stability_impact` | 0-1 | How much the change disrupts existing user commitments. |

### Decision Heuristic

```text
high value + high confidence + low risk + low effort -> apply automatically
medium risk or medium stability impact -> create logged candidate/proposal
high risk or high effort -> require confirmation
sensitive action -> hard confirmation or block
low value or low confidence -> skip or observe longer
```

The heuristic must be overridden by protected boundaries.

## Decision Outputs

The decision step may produce:

| Output | Meaning |
|---|---|
| `skip` | Do nothing. |
| `observe_more` | Keep signal history but do not change Hub. |
| `data_update_patch` | Update data for an existing component. |
| `component_instance_patch` | Add a display component instance. |
| `layout_patch` | Reorder, fold, move, or add page composition. |
| `growth_proposal` | Ask for user confirmation or review. |
| `promotion_candidate` | Mark component/workflow as eligible for next level. |
| `hard_confirmation_request` | Explicitly request confirmation for sensitive or high-risk action. |
| `block` | Refuse or prevent unsafe change. |

## Proposal Model

A **Growth Proposal** is a user-reviewable object describing a possible Hub change.

It is required when:

- effort is high,
- risk is high,
- change affects protected surfaces,
- change adds interactive workflow,
- change introduces a new component type,
- change proposes standalone plugin,
- candidate touches sensitive domains.

Example:

```yaml
id: proposal-finance-review-workflow
kind: interactive_surface_candidate
title: Finance Review Surface
created_at: "2026-04-19T00:00:00+08:00"
source_signal: signal-finance-review-repetition
reason: "The user repeatedly asks for finance review workflows that would benefit from structured checklist UI."
expected_value:
  felt_growth: "Shows finance review as a stable protected world."
  interaction_upgrade: "Reduces repeated prompt setup through a review checklist."
risk:
  level: 4
  reasons:
    - "Finance workflow may involve sensitive data."
    - "Must not imply live account access or financial advice."
recommended_action:
  type: create_candidate_component
  level: 1
alternatives:
  - keep_display_only
  - create_private_candidate_only
  - ignore_until_more_repetition
requires_confirmation: true
```

## Layout Patch Model

A **Layout Patch** describes a reversible Hub state change.

It should be declarative and validate before application.

Patch types:

| Type | Meaning |
|---|---|
| `add_component` | Add a component instance to a section or page. |
| `update_component_data` | Update data binding or referenced data. |
| `move_component` | Move component between zones or pages. |
| `fold_component` | Reduce prominence without archiving. |
| `archive_component` | Remove from active surfaces but keep recoverable. |
| `pin_component` | Mark as protected by user intent. |
| `create_page` | Add a world or field page. |
| `update_page_composition` | Adjust page component order or grouping. |
| `create_change_record` | Write audit metadata. |

Example:

```yaml
id: patch-add-growth-protocol-surface
created_at: "2026-04-19T00:00:00+08:00"
risk_level: 1
operations:
  - op: add_component
    component_id: growth-protocol-progress
    target:
      surface: home
      section: now
      position: top
  - op: create_change_record
    file: changes/2026-04-19-growth-protocol-progress.json
rollback:
  strategy: inverse_patch
  operations:
    - op: remove_component
      component_id: growth-protocol-progress
```

## Auto vs Confirm Rules

### Can Apply Automatically

Only when all are true:

- risk is low,
- effort is low,
- protected surfaces are not structurally changed,
- component type already exists,
- patch validates,
- rollback exists,
- change record can be written,
- user policy does not require confirmation.

Examples:

- update digest data,
- add ephemeral recent-work card,
- add Growth Log entry,
- fold stale adaptive component,
- update public demo snapshot after review.

### Must Create Proposal

When any are true:

- new page composition has medium stability impact,
- repeated workflow may become interactive,
- component is promoted to candidate,
- Host Plugin extension may be needed,
- layout pressure is high,
- user value is high but confidence is medium.

### Must Require Confirmation

When any are true:

- standalone plugin generation,
- installation or removal of plugin,
- external account connection,
- secret or credential handling,
- publish/deploy/share action,
- finance, health, identity, or transaction workflow with real data,
- deletion of protected item,
- irreversible action.

### Must Block

When any are true:

- action would expose private data publicly,
- action would execute generated JavaScript from untrusted files,
- action would inject raw HTML from generated state,
- action would modify live Hermes deployment during independent repo phase,
- action violates an explicit user policy.

## Promotion Model

Promotion turns repeated low-cost surfaces into stable interaction surfaces or plugins.

Promotion stages:

```text
observed pattern
-> display component
-> candidate world/page
-> interactive surface
-> Host Plugin extension
-> standalone plugin proposal
-> standalone plugin
```

Promotion requires evidence.

Useful evidence:

- repeated use count,
- repeated language pattern,
- manual pin,
- repeated "continue" behavior,
- data update frequency,
- user feedback,
- automation frequency,
- workflow friction,
- need for structured input,
- need for edit/review/approval,
- need for independent state.

Promotion blockers:

- no stable data schema,
- low confidence,
- sensitive permissions unresolved,
- user repeatedly hides/rejects similar components,
- high maintenance cost,
- no clear interaction upgrade.

## Audit And Undo

Every applied change must create a change record.

Change record requirements:

- trigger,
- reason,
- source signal or user action,
- risk level,
- affected files,
- before/after summary,
- rollback pointer,
- whether it entered Growth Log,
- whether user confirmation was required.

Undo requirements:

- data update can restore prior data file or patch,
- component add can remove component and manifest references,
- layout move can restore prior placement,
- archive can unarchive,
- promotion candidate can be demoted,
- protected item deletion should not be automatic.

## Learning From User Feedback

The protocol should treat user actions as policy feedback.

| User Action | Learning Effect |
|---|---|
| pin | Increase stability and protect similar surface. |
| hide | Reduce priority of similar component type or topic. |
| archive | Lower recency weight but preserve recoverability. |
| open repeatedly | Increase value and durability. |
| run action repeatedly | Increase promotion likelihood. |
| undo | Lower confidence in similar automatic changes. |
| reject proposal | Reduce promotion likelihood for similar workflow. |
| edit component | Preserve user's version and avoid overwriting. |

Learning should be logged. It should not silently override explicit user policy.

## Protocol Objects

The protocol implies future schemas:

- `growth-signal.schema.json`
- `growth-score.schema.json`
- `growth-decision.schema.json`
- `growth-proposal.schema.json`
- `layout-patch.schema.json`
- `promotion-candidate.schema.json`
- `undo-record.schema.json`
- `policy-feedback.schema.json`

These should extend, not replace, the current manifest/page/component/change schemas.

## MVP Scope

The first implementable MVP should support:

1. Growth Signal files.
2. Growth Proposal files.
3. Layout Patch files.
4. Validator checks for proposal and patch shape.
5. A dry-run command that reports what a patch would change.
6. A private working Hub example.
7. A public-safe demo proposal example.

It should not yet:

- connect to live Hermes,
- execute patches against live deployment,
- generate standalone plugins,
- install integrations,
- run generated JavaScript,
- auto-publish public demos.

## Example Scenario

User repeatedly redirects the project from UI polish back to core protocol.

Signal:

```yaml
kind: repeated_project_focus
summary: "User clarified that the core is a self-iterating agent homepage, not demo polish."
suggested_track: functional_growth
confidence: 0.91
```

Decision:

```yaml
output: component_instance_patch
reason: "The project should surface Growth Protocol as the active workstream."
risk_level: 1
```

Patch:

```yaml
operations:
  - op: add_component
    component_id: growth-protocol-active-work
    target:
      surface: home
      section: now
```

Audit:

```yaml
change_record:
  reason: "User confirmed Growth Protocol as the next priority."
  growth_log: true
  rollback: inverse_patch
```

## Design Implications

The UI should not simply display manifest fields.

The UI should render protocol meaning:

- signal becomes contextual awareness,
- proposal becomes review surface,
- patch becomes understandable change,
- audit becomes trust,
- undo becomes safety,
- promotion becomes visible maturation,
- protected status becomes stability, not noise.

This is why the static demo renderer should be redesigned after the protocol is defined. Visual composition must serve protocol semantics, not raw schema structure.
