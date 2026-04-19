# Codebase Structure

**Analysis Date:** 2026-04-19

## Directory Layout

```
hermes-personal-hub/
├── docs/             # Design documentation, specs, decisions
├── examples/         # Example demo hub instance
├── packages/         # Core runtime packages
├── .local/           # Private working hub (git-ignored)
├── .planning/        # Planning and analysis outputs
├── stitch_minimalist_bilingual_ui/  # UI module stubs
├── package.json      # Root package configuration
└── README.md         # Project overview
```

## Directory Purposes

**docs:**
- Purpose: Project documentation and design artifacts
- Contains: Technical specifications, architecture decisions, visual design notes
- Key files: `docs/specs/2026-04-17-hermes-personal-hub-design.md`, `docs/specs/2026-04-19-growth-protocol.md`, `docs/specs/2026-04-19-core-runtime-roadmap.md`

**examples:**
- Purpose: Demo/example hub instance that can be publicly shared
- Contains: Complete hub with manifest, components, pages, data, CSS theme
- Key files: `examples/personal-hub/hub.manifest.yaml`, `examples/personal-hub/theme.css`, `examples/personal-hub/tokens.css`

**packages:**
- Purpose: Core runtime packages implementing the Hermes Personal Hub protocol
- Contains: Four packages - schemas, validator, patch-engine, renderer
- Key files:
  - `packages/schemas/*.schema.json` - JSON Schema definitions
  - `packages/validator/src/validateHub.js` - Validation logic
  - `packages/patch-engine/src/applyPatch.js` - Patch application
  - `packages/renderer/src/renderHubPage.js` - Static HTML rendering

**packages/schemas:**
- Purpose: JSON Schema definitions for all document types
- Contains: Eight schema files covering manifest, page, component, change, growth signal, proposal, patch, undo record

**packages/validator:**
- Purpose: Hub loading and validation
- Contains: `src/` with CLI and validation logic, `test/` with test fixtures
- Key files: `packages/validator/src/loadHub.js`, `packages/validator/src/validateHub.js`

**packages/patch-engine:**
- Purpose: Dry-run and apply layout patches
- Contains: `src/` with engine implementation, `test/` with test fixtures
- Key files: `packages/patch-engine/src/dryRunPatch.js`, `packages/patch-engine/src/applyPatch.js`

**packages/renderer:**
- Purpose: Static HTML rendering
- Contains: `src/` with renderer, `test/` with tests
- Key files: `packages/renderer/src/renderHubPage.js`

**.local:**
- Purpose: Private personal working hub (not committed to git)
- Contains: Same structure as examples/personal-hub but with private data
- Committed: No (git-ignored)

**.planning:**
- Purpose: GSD planning and codebase analysis artifacts
- Contains: `codebase/` with mapping documents like this one
- Committed: Yes

**stitch_minimalist_bilingual_ui:**
- Purpose: UI component stitched modules (bilingual design)
- Contains: One directory per UI feature area (analytics, plans, tasks, etc.)

## Key File Locations

**Entry Points:**
- `packages/validator/src/cli.js`: Validation CLI
- `packages/patch-engine/src/cli.js`: Patch dry-run/apply CLI
- `packages/renderer/src/cli.js`: Static rendering CLI

**Configuration:**
- `package.json`: Root npm scripts and dependencies
- All hub configuration is YAML-based within the hub directory

**Core Logic:**
- `packages/validator/src/`: Validation and loading
- `packages/patch-engine/src/`: Patch engine
- `packages/renderer/src/`: Static rendering
- `packages/schemas/`: JSON Schema definitions

**Testing:**
- `packages/*/test/`: Package tests with Node.js test runner
- `packages/*/test/fixtures/`: Test hub fixtures

## Naming Conventions

**Files:**
- kebab-case for all source files: `dryRunPatch.js` (camelCase for JS, kebab-case for directories/YAML)
- `.yaml` extension for YAML files (not .yml)
- `.schema.json` for JSON Schema files
- `*.test.js` for test files

**Directories:**
- kebab-case for all directories: `patch-engine`, `personal-hub`
- Lowercase for all directory names

## Where to Add New Code

**New Core Feature:**
- Primary code: Add to the appropriate package under `packages/{package}/src/`
- Tests: Add to `packages/{package}/test/` with `.test.js` extension

**New Package:**
- Add under `packages/` with `src/` and `test/` subdirectories
- Follow the same pattern as existing packages

**New Hub Component (demo):**
- Add to `examples/personal-hub/components/{component-id}.yaml`
- Add data file to `examples/personal-hub/data/` if needed

**New Design Spec:**
- Add to `docs/specs/` with dated filename: `YYYY-MM-DD-topic.md`

**New Utility Function:**
- Add to the appropriate module in the relevant package, or create new module if needed

## Special Directories

**examples/personal-hub/:**
- Purpose: Complete working demo hub
- Generated: No, manually maintained demo
- Committed: Yes

**.local/personal-hub/:**
- Purpose: Private working hub for development
- Generated: Created by user, git-ignored
- Committed: No (contains private data)

**packages/*/test/fixtures/:**
- Purpose: Test data for validation and patching tests
- Generated: No, manually curated test cases
- Committed: Yes

---

*Structure analysis: 2026-04-19*
