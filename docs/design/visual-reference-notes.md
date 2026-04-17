# Visual Reference Notes

Status: Working notes  
Source: local ignored reference folder `stitch_minimalist_bilingual_ui/`  
Public safety: this document extracts design language only. It does not include raw mockup files, generated screenshots, private paths, or placeholder secret strings from the reference assets.

## Reference Role

The local reference material should guide future UI design for Hermes Personal Hub. It is not part of the public source tree and should not be committed directly.

Use it to inform:

- Visual language.
- Layout rhythm.
- Component tone.
- Bilingual typography.
- Tactical workspace details.
- Asset and material direction.

Do not copy:

- Raw generated HTML.
- Screenshot assets.
- Remote image URLs.
- Placeholder credentials or security labels.
- Any local/private paths.

## Creative North Star

The reference direction can be summarized as:

> Tactical precision meets minimalist editorial Life OS.

It should feel like a serious personal operating surface, not a generic SaaS dashboard. The interface should read as an instrument for organizing a person's active worlds, not as a decorative AI product shell.

## Core Visual Traits

### Sharp Geometry

- Prefer square, precise geometry.
- Use little to no border radius.
- Avoid soft consumer-app rounded cards.
- Use corner brackets, edge markers, and alignment instead of heavy frames.

### High-Contrast Light Foundation

- Use a light canvas as the default.
- Treat whitespace as structure.
- Use subtle surface tiers for depth.
- Avoid heavy shadows and glossy gradients.

### Tactical Accents

Recommended accent roles:

- Blue for primary action and active system focus.
- Green for verified, successful, or healthy state.
- Red for destructive or high-risk state.
- Orange for caution, tracking, or active monitoring.

Accent colors should be sparse and meaningful.

### Grid And Alignment

- Prefer an underlying grid rhythm.
- Use alignment as a boundary.
- Let dense data clusters contrast with airy editorial headers.
- Use measured asymmetry instead of evenly repeated dashboard cards everywhere.

### Technical Editorial Typography

Use a dual-typeface strategy:

- Geometric sans for human-facing headlines and navigation.
- Monospace for labels, timestamps, IDs, metrics, status, and technical values.

For bilingual UI:

- Pair English and Chinese intentionally.
- Keep baseline alignment.
- Let Chinese text be slightly lighter or smaller when paired with all-caps English labels.
- Avoid treating Chinese copy as an afterthought.

## Component Implications

### Cards

Cards should feel like structured data surfaces rather than floating consumer cards.

Preferred:

- Square corners.
- Technical stamp or provenance marker.
- Sparse accent edge or corner bracket.
- Strong title + small mono metadata.
- Clear source and lifecycle state.

Avoid:

- Excessively rounded card stacks.
- Generic drop shadows.
- Decorative gradients.
- Cards inside cards.

### Navigation

Navigation can feel like an operating surface:

- Compact mono labels.
- Active-state rail or edge marker.
- Clear system/status affordances.
- Bilingual page titles where useful.

### Growth Signals

Growth signals should be visually concrete:

- Status stamp.
- Timeline marker.
- Diff marker.
- Promotion badge.
- Provenance chip.
- `why_here` disclosure.

They should not become confetti, praise banners, or gamified noise.

### Controls

Buttons and inputs should feel precise:

- Rectangular primary buttons.
- Ghost/tactical secondary buttons.
- Small status bars or corner brackets for active/focused states.
- Monospace labels for command-like controls.

## Personal Hub Adaptation

The reference style should be adapted to Life OS goals:

- Keep the tactical feeling, but avoid making the product feel militarized or hostile.
- Preserve editorial calm for personal reflection and growth.
- Make agent-generated surfaces feel trustworthy through provenance, not through spectacle.
- Use density where useful, especially for status and logs, but allow reading surfaces to breathe.

## Design Policy Updates To Consider

Future `VISUAL_POLICY.md` should include:

- `radius: none | minimal`
- `grid: visible | subtle | off`
- `typography.mode: technical_editorial`
- `bilingual: true`
- `surface.depth: tonal`
- `accent.use: semantic_only`
- `generated_css: disallowed_for_display_growth`
- `raw_html: disallowed`

## Open Design Questions

- How tactical should the default theme feel before it becomes too cold for a personal Life OS?
- Should the first public demo use a light theme only, or include a dark tactical mode?
- How much bilingual UI should be part of the default product versus the user's personal policy?
- Which visual assets should become reusable open-source primitives rather than private reference material?
