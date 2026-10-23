# Toolkit Maintainer Instructions

This repository authors a .NET AI toolkit; it is not itself a .NET service. Do not apply consumer application templates to the toolkit's own folder layout.

## Structure and Commands

- `toolkit.json` explicitly lists installable templates, knowledge, guides, skills, roles, host configuration, and MCP examples.
- `skills/` and `agents/` are canonical. Do not maintain hand-copied host-specific duplicates.
- `plugins/` owns repository-only plugin packaging guidance, not duplicate capabilities or active host registration. It is not installed by `scripts/install.mjs`; actual host packages require verified native manifests, resource routing, and isolated packaging tests.
- Keep `evals/`, `mcp/`, `templates/`, and `knowledge/` separate. `templates/README.md` indexes five project types and independent concept templates; do not introduce a booking-specific wrapper.
- Host guidance belongs in `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, and `.github/`. No separate host-abstraction directory is needed.
- `scripts/install.mjs` renders selected host configuration into a separate existing target, with conflict preflight and no overwrites.
- Node.js version support is declared by `package.json`. Toolkit automation has no runtime npm dependencies or build step. The separate `website/` package uses Nextra/Next.js; see `docs/website.md` for its locked dependencies, static build, and Pages deployment.
- Run `npm run validate`, `npm test`, or the required combined gate `npm run check`.
- CI runs that gate on Windows and Linux. Tests use temporary directories, never sibling reference repositories.

## Working Rules

Keep every capability related to .NET application development. Preserve distinct class-library, modular-monolith, monolith, web-api, and microservice shapes. Keep vertical slice, feature slice, validation, endpoint, persistence, messaging, and test concepts independently selectable. Follow target code over defaults; never force service layout on every project or fabricate shared APIs/distributed guarantees.

Use standard Node.js APIs for toolkit automation. Add a dependency only when justified. Preserve installer dry-run, repeatability, conflict refusal, and symlink checks. No automatic hooks, MCP activation, deployment, or schema changes.

For a new skill, update the catalog, discovery fixtures, README, and changelog; use matching folder/frontmatter names. For a role, provide a meaningful catalog description and verify generated read-only metadata. See the authoring guide for the full maintenance chain.

## Template and Role Routing

Keep explicit `## Template Routing` sections in canonical skills and roles. Use complete installed paths and task-specific conditions:

```text
- Read `.ai-toolkit/templates/<concept>/README.md` when <condition>.
```

In this checkout, inspect the corresponding `templates/` paths. Each template must have a relevant skill route and a relevant role route; this is collective coverage, not a requirement for every workflow to load every guide.

Choose the actual project shape from target evidence before loading concepts. Extend existing workflows rather than adding a skill or agent per template. Preserve read-only review, planning, and incident boundaries; a template read never authorizes execution or infrastructure changes.

Keep the four roles distinct: architecture/ownership advice, boundary review, test planning, and incident evidence analysis. Role handoffs state inspected evidence, applicable guides, assumptions, proposed checks, and the primary assistant's next workflow. Proposed commands are not executed results. The primary assistant owns edits, executable validation, and approval requests.

When changing role bodies or catalog descriptions, verify every generated Copilot/Claude role retains canonical content, current discovery metadata, and read/search-only tools. Codex, Cursor, and OpenCode receive advisory documents; do not claim native role registration or enforced permissions there. Routing tests check catalog coverage and installed paths, not live assistant selection or compliance.

After the first substantive edit, run the smallest relevant test immediately. Before handoff, run `npm run check`. Report live assistant, .NET runtime, and deployment checks as unverified unless actually executed.

Original content only: reference kits provide ideas, never copied prompts/scripts/assets. Do not commit or publish without explicit authorization.