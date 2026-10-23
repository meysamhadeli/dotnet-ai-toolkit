# Changelog

Notable changes follow Keep a Changelog conventions. Versions describe toolkit content and automation, not target .NET SDK versions.

## [Unreleased]

### Added

- One-command Vercel skills adoption through a generated self-contained archive, with bundled per-skill templates/knowledge, adapted resource paths, preserved canonical sources, and separate full-toolkit installation guidance.

- Original Nextra documentation website with responsive landing page, dark/light themes, canonical workflow/role/template reference generation, Pagefind search, onboarding guides, and static-export link checks.
- Isolated locked website dependencies, focused documentation tests, and a least-privilege GitHub Pages workflow that builds PRs without deploying them.

- Repository-specific Release Drafter v7 configuration, CI-gated unpublished draft updates, and a separate metadata-only PR labeler; publication and version-file updates remain manual.
- Separate repository-only `plugins/` folder for host packaging guidance, preserving canonical sources and excluding implicit installation or activation.
- Dedicated `dotnet-architecture` planning and `dotnet-api` HTTP-boundary skills, with conditional template routing, distinct neighboring workflow boundaries, discovery fixtures, and five-host installation coverage.

### Changed

- Restructured README around positioning, installation, assistant support, task-based workflows, project shapes, trust boundaries, and documentation navigation.

- Preserved Windows/Linux and Node.js 22/24 validation while adding CI concurrency, timeouts, manual dispatch, and credential-free checkouts; kept the Copilot setup gate aligned.
- Renamed `dotnet-add-slice` to `dotnet-add-feature-slice` across its canonical folder, metadata, catalog, discovery fixtures, workflow references, and host installation tests. Existing installations are not automatically migrated or cleaned up.
- Added conditional template routing to all fourteen skills and four read-only advisory roles, with separate catalog-wide static coverage and installed-path checks for all five hosts; no live assistant selection accuracy is claimed.
- Extended maintainer instructions and role handoffs for project-type selection, evidence, proposed checks, and primary-assistant ownership; verified every generated role's metadata and canonical body.
- Reorganized into separate skills, agents, evals, MCP, templates, and knowledge folders, primarily following the reference kit's organization without copying content.
- Replaced the booking-specific template wrapper with a project/concept catalog: class-library, modular-monolith, monolith, web-api, and microservice shapes plus fourteen independent concepts.
- Grounded concept templates in inspected feature, validation, endpoint, pipeline, persistence, and test implementations; preserved module/monolith/library differences from the supplied sources.
- Updated host guidance and workflows to choose the actual project type instead of universally assuming microservices; reusable architecture and verification guidance lives in `knowledge/`.
- Replaced the former host-abstraction directory with `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, and `.github/` configuration.
- Added safe Cursor/OpenCode installation and a folder-structure regression; preserved canonical skills/agents and opt-in MCP behavior.

## [0.1.0] - 2026-10-23

### Added

- Original booking-style microservices profile and service, slice, and message-flow blueprints.
- Twelve .NET-only skills and four read-only advisory specialist roles.
- Copilot, Claude Code, and Codex local installation adapters.
- Conflict-safe installer with dry-run, identical-file reuse, receipts, and symlink refusal.
- Opt-in Microsoft Learn MCP examples; no automatic server or hook activation.
- Catalog/link/metadata checks, discovery fixtures, installer regressions, and Windows/Linux CI.
- Adoption, operations, authoring, contribution, and maintainer guidance.