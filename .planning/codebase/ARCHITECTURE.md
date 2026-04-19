# Architecture

**Analysis Date:** 2026-04-19

## Pattern Overview

**Overall:** Monorepo with YAML-based declarative hub architecture

**Key Characteristics:**
- Separation of concerns across four core packages
- Declarative YAML format for hub manifest, components, pages, and patches
- JSON Schema validation for all document types
- File-based content organization with predictable directory structure
- Reversible incremental growth through patch operations
- Static HTML rendering for demo/public export

## Layers

**Schemas:**
- Purpose: Define structure for all document types in the Personal Hub
- Location: `packages/schemas/`
- Contains: JSON Schema files for manifest, pages, components, changes, patches, growth signals, proposals, undo records
- Depends on: None (pure definitions)
- Used by: Validator package for schema validation

**Validator:**
- Purpose: Load and validate Personal Hub structure and content
- Location: `packages/validator/src/`
- Contains: Hub loading, schema validation, reference validation
- Depends on: Schemas, Ajv JSON validator, YAML parser
- Used by: Patch engine, Renderer, CLI validation commands

**Patch Engine:**
- Purpose: Execute layout patches with dry-run preview and risk checking
- Location: `packages/patch-engine/src/`
- Contains: Dry-run analysis, patch application, change tracking
- Depends on: Validator, YAML parser
- Used by: CLI commands for previewing and applying patches

**Renderer:**
- Purpose: Generate static HTML from hub configuration
- Location: `packages/renderer/src/`
- Contains: HTML templating, component rendering, data preview
- Depends on: Validator (for hub loading)
- Used by: CLI commands for generating static demo exports

## Data Flow

**Hub Validation Flow:**

1. Loader reads the hub directory structure and parses all YAML/JSON documents
2. Validator compiles JSON Schema validators for each document type
3. Each document is validated against its schema
4. Cross-references are checked (components referenced on pages/home must exist, data files must exist)
5. Aggregated errors are returned

**Patch Application Flow:**

1. Dry-run engine loads hub and patch
2. Each operation is analyzed for preconditions (target exists, component exists)
3. Risk level is checked against maximum allowed risk
4. If dry-run passes, apply executes operations and modifies files
5. Change record is created for auditability and undo

**Static Rendering Flow:**

1. Renderer loads hub configuration
2. Components are mapped by ID
3. Each home section is rendered with its components
4. Component data is loaded from external files if present
5. Complete HTML page is returned with CSS references

## Key Abstractions

**Hub:**
- Purpose: Encapsulates the entire Personal Hub content and structure
- Examples: `packages/validator/src/loadHub.js`
- Pattern: Loads all documents from the standard directory structure into a single object with parsed data

**Layout Patch:**
- Purpose: Declaratively describes changes to hub layout and structure
- Examples: `packages/patch-engine/src/dryRunPatch.js`, `packages/schemas/layout-patch.schema.json`
- Pattern: Contains operations (add_component, create_change_record), risk level classification, and rollback operations

**Component:**
- Purpose: Self-contained UI card with title, status, explanation, and optional external data
- Examples: `packages/schemas/component.schema.json`, `packages/renderer/src/renderHubPage.js`
- Pattern: YAML declaration with separate data file for dynamic content, supports status levels (protected/candidate)

## Entry Points

**Validation CLI:**
- Location: `packages/validator/src/cli.js`
- Triggers: Command-line invocation `npm run validate:demo`
- Responsibilities: Validate an entire hub directory and report errors

**Patch CLI:**
- Location: `packages/patch-engine/src/cli.js`
- Triggers: Command-line invocation `npm run dry-run:demo`
- Responsibilities: Dry-run a patch and output operation preview, risk assessment, and errors

**Renderer CLI:**
- Location: `packages/renderer/src/cli.js`
- Triggers: Command-line invocation `npm run render:demo`
- Responsibilities: Render hub to static HTML file for public demo

## Error Handling

**Strategy:** Collect all errors before failing

**Patterns:**
- Aggregates schema errors and reference errors into a single list
- Dry-run fails fast if any operation has errors, no changes are written
- Patch application rejects if risk level exceeds configured maximum
- CLI returns non-zero exit code on validation failure

## Cross-Cutting Concerns

**Logging:** Direct console output for CLI tools, no structured logging in core libraries
**Validation:** Two-phase validation - JSON Schema validation followed by cross-reference validation
**Authentication:** Not implemented in this layer (deferred to Hermes Host Plugin)
**Versioning:** Schema version tracking at the manifest level

---

*Architecture analysis: 2026-04-19*
