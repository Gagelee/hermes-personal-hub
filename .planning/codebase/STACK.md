# Technology Stack

**Analysis Date:** 2026-04-19

## Languages

**Primary:**
- JavaScript (ES6 Modules) - ECMAScript 2020+ - Full implementation across all packages

**Secondary:**
- JSON - Schema definitions and data storage
- YAML - Patch format and hub manifest

## Runtime

**Environment:**
- Node.js v25.2.1

**Package Manager:**
- npm 11.6.2
- Lockfile: present (package-lock.json)

## Frameworks

**Core:**
- No web framework used - vanilla Node.js CLI tools

**Testing:**
- Node.js built-in test runner - Version matches Node.js v25.2.1 - Native test runner without external dependencies

**Build/Dev:**
- No build tooling required - direct ESM execution

## Key Dependencies

**Critical:**
- ajv ^8.17.1 - JSON Schema validation for all hub artifacts (manifest, components, pages, changes)
- yaml ^2.7.0 - YAML parsing for layout patches

**Infrastructure:**
- All dependencies are direct and minimal - no transitive infrastructure requirements

## Configuration

**Environment:**
- No environment configuration required - all configuration is via file system layout
- Key configs required: None - operates purely on input directory structure

**Build:**
- No build configuration - source files are executed directly

## Platform Requirements

**Development:**
- Node.js v20+ recommended (tested on v25.2.1)
- macOS/Linux environment expected (file system paths use POSIX conventions)

**Production:**
- Designed as CLI tooling - can run anywhere Node.js is available
- Static HTML output from renderer can be hosted on any static web host

---

*Stack analysis: 2026-04-19*
