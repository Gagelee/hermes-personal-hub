# Domain Pitfalls

**Domain:** Patch-based undo engine for file-based personal hub
**Researched:** 2026-04-19

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: Forgetting Concurrent Modification Checks
**What goes wrong:** The original patch creates a change based on a specific manifest state. Between patch apply and undo, the user or agent has modified the same manifest (e.g., added more components to the same section). Undo naively removes the component but doesn't check if other changes happened in between.

**Why it happens:** The system assumes the change record still points to the exact state it captured. In a personal hub with automatic growth, changes can happen frequently.

**Consequences:**
- Undo can remove the wrong component if the list has changed
- The manifest can become inconsistent
- Corrupted layout state that's hard to recover manually
- Users lose trust in the undo guarantee

**Prevention:**
- Every change record must capture the pre-patch state (e.g., the full manifest content hash or the component list before modification)
- Before applying undo, check that the current state matches the expected state the undo was created from
- If divergence is detected, refuse unsafe undo and ask for user review
- Use "best effort" merge only when the conflict is unambiguously resolvable

**Detection:**
- Undo succeeds but layout doesn't match expectations
- Component IDs go missing from manifest after undo
- Validation passes but UI is broken

---

### Pitfall 2: Incomplete Rollback - Missing Side Effects
**What goes wrong:** The undo engine reverses the primary change (e.g., removes component from manifest) but forgets to clean up created files or reverse related metadata changes. For example: undoing an add-component doesn't remove the component YAML file and data files.

**Why it happens:** Patches create multiple related files across directories. The rollback operations list can be incomplete if the original patch doesn't capture every file created.

**Consequences:**
- Orphaned files accumulate in the hub directory
- Component IDs remain referenceable by accident
- Hub state becomes cluttered with "deleted" content
- Validation passes but stale data persists

**Prevention:**
- The original patch must explicitly declare all rollback operations when it's created, not when undo runs
- Every file created by the patch must have a corresponding delete in rollback
- Use a "record everything" approach: the patch apply step logs every write operation as it happens to build the rollback list automatically
- After undo completes, validation should check for orphaned references

**Detection:**
- `find` command shows leftover files after undo
- Validator doesn't complain but growth log references deleted components

---

### Pitfall 3: Not Validating After Undo
**What goes wrong:** Undo completes without error but leaves the Hub in an invalid state (e.g., a home section becomes empty, references are broken). The undo engine assumes if the file writes succeeded, everything is fine.

**Why it happens:** Validation already runs before patch apply, so people assume undo "can't fail" or doesn't need it. Undo is just another state transition that can introduce errors.

**Consequences:**
- Hub becomes unrenderable after undo
- User has no clear indication what broke
- Recovery requires manual file editing
- Complete breakage of user experience

**Prevention:**
- Run the full validator suite after every undo operation
- If validation fails, roll back the undo attempt (transactional undo)
- Report validation errors clearly to the user before finalizing
- Keep a backup of the pre-undo state until validation passes

**Detection:**
- Tests don't cover post-undo validation
- Undo operation reports success but UI won't load

---

### Pitfall 4: Ignoring Protected/Pinned Policy Violations
**What goes wrong:** The undo engine allows undo that would un-protect a pinned component or violate layout policy, because it doesn't recheck policy after applying undo.

**Why it happens:** Policy is checked on original patch apply, but undo can indirectly violate policy by removing the protection flag or modifying a protected section.

**Consequences:**
- Undo can silently remove user pins
- Protected layout can be accidentally changed
- Violates the core trust guarantee that "pinned items don't move"

**Prevention:**
- Load and enforce layout policy before executing any undo
- Check that undo operations don't modify protected sections unless explicitly permitted by the user
- If the original change already modified a protected section (with confirmation), undo is generally safe, but still need to verify

**Detection:**
- User pins disappear after undo operations
- Protected sections get modified without confirmation

## Moderate Pitfalls

### Pitfall 1: No Undo of Undo Support
**What goes wrong:** User undoes a change, then wants to redo it. There's no record of the original change after undo completes.

**Why it happens:** The engine deletes the original change record when undo completes.

**Prevention:** Archive the original change record instead of deleting it. Keep the undo record that documents what was undone. Allow re-apply from the archive.

### Pitfall 2: Corrupted YAML/JSON Formatting During Modification
**What goes wrong:** Undo removes an entry from the manifest but leaves behind trailing commas or bad YAML indentation.

**Why it happens:** Manual string manipulation instead of parsing, modifying, and re-serializing the entire document.

**Prevention:** Always parse the full YAML/JSON into an object, modify the object, then re-stringify the entire document. Never do in-place text edits.

### Pitfall 3: Not Handling Missing Files Gracefully
**What goes wrong:** The user already deleted the file manually outside the system. Undo tries to delete it again and crashes.

**Why it happens:** Assumption that the file still exists when undo runs.

**Prevention:** Treat "file not found" for deletion as success already accomplished. Only fail when the required state removal cannot be achieved.

### Pitfall 4: Storing Undo Metadata Inconsistently
**What goes wrong:** Change records and undo records live in different places or use different schemas. Growth Log doesn't show undo operations.

**Why it happens:** Undo is an afterthought, bolted onto the existing change record structure.

**Prevention:** Undo is itself a change that needs a change record. Every undo creates a new record in the `changes/` directory so the Growth Log shows the full history: patch applied → patch undone.

## Minor Pitfalls

### Pitfall 1: No Dry-Run for Undo
**What goes wrong:** User wants to know what undo will do before committing, but can't preview.

**Prevention:** Implement undo dry-run just like patch dry-run. Show what files will be changed or deleted.

### Pitfall 2: Path Traversal Vulnerabilities
**What goes wrong:** Malicious patch could craft rollback paths that delete files outside the hub directory.

**Prevention:** Resolve all paths and validate they stay within the hub root. Reject any path with `../` that escapes the hub directory.

### Pitfall 3: Race Conditions With Multiple Undos
**What goes wrong:** Two undo operations run at the same time and conflict with each other.

**Prevention:** Use file locking or sequence undo operations through the host runtime. Don't allow concurrent writes to the manifest.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation | Which Phase |
|-------------|---------------|------------|-------------|
| Basic undo engine for add_component/create_change_record | Incomplete rollback (missing created files) | Capture all written files at patch apply time, build rollback list automatically | Phase 4 (current) |
| Basic undo engine | Concurrent modification check | Capture pre-patch state hash, verify before undo | Phase 4 (current) |
| Basic undo engine | Post-undo validation | Run full validation after every undo, refuse if invalid | Phase 4 (current) |
| Basic undo engine | Policy checking on undo | Load policy before undo, check against protected sections | Phase 4 (current) |
| Multiple operation types | Format corruption from in-place editing | Always parse-modify-write full documents | Phase 4+ when adding modify/remove operations |
| Growth Log integration | Missing undo records in log | Every undo creates its own change record | Phase 4 |
| Redo support | Can't undo an undo | Archive don't delete, keep full history | Phase 4 follow-up / Phase 5 |
| UI interaction | No undo preview | Add undo dry-run before user confirmation | Phase 6 when building host runtime UI |
| Security | Path traversal in undo paths | Validate all paths stay within hub root | Phase 4 - should address early |

## Sources

Based on analysis of the Hermes Personal Hub architecture and common patterns in file-based state management with declarative patches. Key observations from the existing code:

- Current patch engine supports `add_component` and `create_change_record`
- Rollback strategy is already defined in the patch schema
- Validation infrastructure exists and is reusable for post-undo checks
- Policy boundaries (Protected/Adaptive/Experimental/Ephemeral) are already defined

Confidence: HIGH for critical pitfalls - these are classic mistakes in rollback systems that can be avoided by explicit design.
