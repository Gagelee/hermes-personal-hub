# Technology Stack

**Project:** Hermes Personal Hub - Undo Engine
**Researched:** 2026-04-19

## Recommended Stack

### Core Framework
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| Node.js built-in `fs/promises` | Current (Node 20+/22+) | File system operations | Already in use, native API has all needed capabilities for this use case. No extra dependency needed. |
| **Command Pattern (hand-rolled)** | N/A | Undo/rollback execution | The system already defines patches with explicit rollback operations. A simple command execution pattern fits perfectly with the existing file-based architecture. |
| Existing `yaml` | ^2.7.0 | YAML parsing | Already in use, mature, well-maintained, no changes needed. |
| Existing `ajv` | ^8.17.1 | JSON Schema validation | Already in use, validates undo records and patches, no changes needed. |
| Node.js built-in `test runner` | Current | Testing | Already in use, sufficient for this module. |

### Database / Storage
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **File-based change records** | N/A | Store undo history | The entire system is file-based. Storing undo records as JSON in `changes/` and `undo/` directories matches the existing architecture. No database needed. |

### Infrastructure
| Technology | Version | Purpose | Why |
|------------|---------|---------|-----|
| **Inverse patch strategy** | N/A | Rollback approach | Patches already declare their own rollback operations in the patch file. This is simple, explicit, and fits the agent-generated patch model. |

### Supporting Libraries
No additional libraries are needed for Phase 4. The undo engine can be implemented with existing dependencies.

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| *(none required)* | — | — | For this file-based patch system with explicit inverse operations, no extra undo libraries are needed. |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Undo Approach | Inverse patch command pattern | Memento / full snapshot copying | Full snapshots would bloat storage (copying entire manifest every change). Hermes already uses incremental patches, so incremental inverse patches are more efficient. |
| Undo Approach | Inverse patch command pattern | Full git-based history | Git is overkill — we only need single-step undo per patch, not full branching history for this phase. Git would add dependency on installed git and complicate the API. |
| Library | Custom command pattern | General-purpose undo libraries like `undo-js`, `zundo` | Most undo libraries target in-memory state (UI state stores), not file system operations. They don't handle the file I/O and validation needs of this system. |
| Storage | File-based JSON records | SQLite for history | SQLite adds complexity, dependency, and doesn't fit the existing file-based content model that agents can read and write directly. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Full file snapshots on every patch | Wastes disk space, creates large diff noise, slows down agent operations | Inverse operations stored with the original patch |
| General-purpose "undo/redo stack" libraries | Designed for in-memory application state, not persistent file operations | Simple command executor that reads rollback operations from the patch |
| External version control systems (git) as primary undo | Requires git to be installed in the runtime environment, adds unnecessary complexity, overkill for single-step undo | Native file system with explicit change records |
| In-memory undo history only | Won't survive process restarts, doesn't match the persistent file-based nature of the Hub | Persist undo records to disk alongside change records |

## Installation

No new dependencies required for Phase 4. Use what's already installed.

```bash
# Core is already installed, these are the existing dependencies:
npm install ajv yaml

# No new packages needed for undo engine
# Dev dependencies already include Node test runner
```

## Compatibility Notes

- The undo engine fits naturally with the existing patch dry-run/apply architecture
- Uses the same validation approach through ajv
- Works with the existing change record directory structure
- No breaking changes to existing APIs expected

## Sources

- Based on existing project architecture and patterns already established in the codebase
- Command pattern for undo is a standard, well-understood pattern for reversible operations
- File-based incremental patches with inverse operations matches the existing Hermes design
- No external libraries needed — simplicity fits the project's current scope

---
Stack research for: Undo Engine for patch-based file system<br>
Researched: 2026-04-19
