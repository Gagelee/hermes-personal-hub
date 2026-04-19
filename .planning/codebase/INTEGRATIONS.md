# External Integrations

**Analysis Date:** 2026-04-19

## APIs & External Services

**None:**
- This is a standalone CLI toolset for working with local personal hub repositories
- No external API calls are made by core packages

## Data Storage

**Databases:**
- None - all data is stored as JSON/YAML files on the local filesystem

**File Storage:**
- Local filesystem only - reads/writes hub data from local directory structure

**Caching:**
- None - no caching implemented, all operations read directly from disk

## Authentication & Identity

**Auth Provider:**
- None - no authentication required (offline/local tooling)

## Monitoring & Observability

**Error Tracking:**
- None - errors are written to stderr and process exits with non-zero code

**Logs:**
- Console/stderr output only - no structured logging to external services

## CI/CD & Deployment

**Hosting:**
- Designed as CLI tool to be run locally or in CI/CD pipelines
- Renderer outputs static HTML that can be hosted on any static hosting (GitHub Pages, etc.)

**CI Pipeline:**
- Not configured in this repository - node --test can be run in any CI environment

## Environment Configuration

**Required env vars:**
- None - all configuration is via command-line arguments and file system structure

**Secrets location:**
- No secrets required - all operations are local file system operations

## Webhooks & Callbacks

**Incoming:**
- None - no HTTP server

**Outgoing:**
- None - no outgoing webhook calls

---

*Integration audit: 2026-04-19*
