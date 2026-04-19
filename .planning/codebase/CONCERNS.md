# Codebase Concerns

**Analysis Date:** 2026-04-19

## Tech Debt

**Patch Engine - Limited Operation Support:**
- Issue: Only two operation types are supported (`add_component`, `create_change_record`). Many planned operations from the Growth Protocol are not yet implemented.
- Files: `packages/patch-engine/src/applyPatch.js`, `packages/patch-engine/src/dryRunPatch.js`
- Impact: Cannot process more complex patches that modify existing components, remove components, or update metadata.
- Fix approach: Implement additional operation types as needed by the Growth Protocol, one at a time with corresponding tests.

**Undo Engine - Not Implemented:**
- Issue: The roadmap explicitly identifies Undo Engine as the next milestone. Currently no rollback/undo functionality exists despite patches containing rollback strategy metadata.
- Files: `packages/patch-engine/` (missing undo implementation), `packages/schemas/layout-patch.schema.json` (rollback field defined but unused)
- Impact: Applied patches cannot be reversed, which increases risk for experimentation. The "Reversible Always" principle is not yet enforced.
- Fix approach: Implement Undo Engine v0 as outlined in the roadmap - support `remove_component` and `remove_change_record` rollback operations, add CLI, test both successful and unsafe rejection cases.

**Static Renderer - Schema-Shaped Output:**
- Issue: The current renderer directly maps schema structure to HTML cards, resulting in a "flat clipboard" experience that exposes internal vocabulary like `why_here` and technical stamps to the output.
- Files: `packages/renderer/src/renderHubPage.js`
- Impact: Public demo output doesn't match the intended Life OS user experience. Not an issue for the current v0 milestone but will need complete refactoring.
- Fix approach: Replace with experience-shaped renderer as outlined in the roadmap - implement command header, world/project rail, focus panel, digest strip, growth surface.

**Missing Host Plugin Boundary:**
- Issue: No host runtime abstraction exists. All functionality is currently CLI/module-based.
- Files: N/A - package `host-plugin/` does not exist yet per planned repo shape
- Impact: Cannot integrate with Hermes dashboard plugin system as intended.
- Fix approach: Implement host runtime skeleton after Undo Engine and Proposal Review are complete.

## Known Bugs

**No Known Bugs:**
- All existing functionality passes tests. Current scope is minimal and well-covered by existing tests.

## Security Considerations

**Path Traversal Minimal Risk:**
- Risk: Patch file operations could potentially write outside the hub root if carefully crafted malicious patches are processed.
- Files: `packages/patch-engine/src/applyPatch.js`
- Current mitigation: Patches are currently only applied manually via explicit CLI invocation by trusted users/agents.
- Recommendations: When the host plugin is built, add path validation that ensures all written file paths stay within the hub root directory.

**No Input Sanitization for HTML:**
- Risk: User-provided content in component titles/labels is escaped via `escapeHtml()` in the renderer, which mitigates XSS in static output. But if dynamic rendering is ever added, XSS could become a risk.
- Files: `packages/renderer/src/renderHubPage.js`
- Current mitigation: All user content output through `escapeHtml()` - see lines 5-12. Current output is static HTML, so stored XSS is not executable in the demo use-case.
- Recommendations: Keep escaping as-is and re-validate XSS protection when moving to dynamic host-rendered UI.

## Performance Bottlenecks

**No Significant Bottlenecks:**
- The codebase currently handles small to medium hub trees (dozens of components). Schema validation reads all schemas on every validation call (see `packages/validator/src/validateHub.js` lines 17-28).
- Files: `packages/validator/src/validateHub.js`
- Cause: Validators are rebuilt on every validation call rather than cached.
- Improvement path: Cache compiled validators once at module initialization time since schemas don't change at runtime. This is a low-priority optimization.

## Fragile Areas

**Cross-Package Imports:**
- Files: Multiple files use relative imports across package boundaries:
  - `packages/patch-engine/src/dryRunPatch.js`: imports from `../../validator/src/loadHub.js`
  - `packages/patch-engine/src/applyPatch.js`: imports from `./dryRunPatch.js` (intra-package, okay)
  - `packages/renderer/src/renderHubPage.js`: imports from `../../validator/src/loadHub.js`
  - `packages/patch-engine/test/applyPatch.test.js`: imports from `../../validator/src/validateHub.js`
- Why fragile: Imports depend on the physical directory structure rather than a package dependency structure. Moving packages would break imports.
- Safe modification: If re-organizing packages, update all relative cross-package imports to use the correct new paths.
- Test coverage: Existing integration tests catch broken imports immediately, so refactoring is safe with tests passing.

**Patch Operation Evolution:**
- Files: `packages/patch-engine/src/applyPatch.js`, `packages/patch-engine/src/dryRunPatch.js`
- Why fragile: Adding new operation types requires changes in multiple places - both dry-run description and apply logic must be updated in sync.
- Safe modification: Add the new operation case in `describeOperation()` (dry-run) *first*, then add the corresponding apply logic. Write tests for both dry-run and apply.
- Test coverage: Dry-run runs before apply, so missing the apply implementation for a new operation will be caught at runtime before any changes are written.

## Scaling Limits

**Current Capacity:**
- Designed for small-to-medium personal hubs (tens to low hundreds of components). All operations load the entire hub into memory synchronously after async reads.
- Limit: Will work fine for personal use even with hundreds of components. Not designed for thousands of concurrent hubs or multi-tenant deployment.
- Scaling path: The architecture is intended for single-user personal use. No scaling changes are anticipated.

## Dependencies at Risk

**All Dependencies Current:**
- `ajv`: 8.18.0 (latest as of analysis) - JSON schema validation
- `yaml`: 2.7.0 (latest as of analysis) - YAML parsing
- Both are well-maintained, mature projects with no known security issues.

**No at-risk dependencies detected.**

## Missing Critical Features

**Proposal Review Flow:**
- Problem: No code exists for proposal listing, review decisions, or outcome recording.
- Blocks: Cannot implement the full Growth Protocol autonomous loop where high-risk changes require review before apply.
- Priority: Medium - scheduled after Undo Engine.

**Rollback/Undo:**
- Problem: As noted in Tech Debt, undo is the missing next milestone.
- Blocks: Safe experimentation with automatic growth is blocked until undo exists.
- Priority: High - per project roadmap, this is the immediate next step.

**Host Plugin Integration:**
- Problem: No integration layer exists for Hermes dashboard plugin system.
- Blocks: Cannot deploy to production Hermes environment.
- Priority: Low - project is explicitly iterating independently before integration per decision 0001.

## Test Coverage Gaps

**CLI Entry Points:**
- What's not tested: CLI entry point scripts (`packages/patch-engine/src/cli.js`, `packages/patch-engine/src/applyCli.js`, `packages/renderer/src/cli.js`, `packages/validator/src/cli.js`) have limited test coverage. Only `applyCli.js` and `validator/cli.js` have basic tests via child_process exec.
- Files:
  - `packages/patch-engine/src/cli.js`
  - `packages/renderer/src/cli.js`
- Risk: CLI argument parsing edge cases could break without detection. Risk is low because CLI is simple and manually used.
- Priority: Low - the core logic is tested, CLI is just argument wrapping.

**Renderer Output Validation:**
- What's not tested: Only a basic smoke test exists that renderer returns HTML. No validation that output structure is correct or that all component types render properly.
- Files: `packages/renderer/src/renderHubPage.js`
- Risk: HTML structure or escaping regressions could slip through. The output is only for static demo currently, so risk is low.
- Priority: Low. When the renderer is rewritten to be experience-shaped, add proper tests for expected output structure.

**Edge Cases for Patch Application:**
- What's not tested: Concurrent patch application, multiple sequential patches, patches that add components to multiple sections.
- Files: `packages/patch-engine/src/applyPatch.js`
- Risk: Race conditions or state corruption if multiple patches applied simultaneously. Current use-case is manual sequential application, so risk is acceptable.
- Priority: Low. Add tests if/when automatic parallel patch application becomes a requirement.

**Operation Type Coverage:**
- What's not tested: Only the two implemented operations have tests. No coverage for unrecognized/unsupported operations.
- Files: `packages/patch-engine/`
- Risk: Unsupported operations fail gracefully by being ignored - dry-run reports "unsupported operation" error and apply doesn't execute. Current behavior is safe.
- Priority: Low.

---

*Concerns audit: 2026-04-19*
