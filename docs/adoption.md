# Adoption

## Choose an Installation

| Method | Includes | Requires |
| --- | --- | --- |
| Vercel `skills` CLI (recommended) | Selected workflows, each with bundled templates and knowledge | Node.js 22.20+, published documentation archive |
| Full local installer (optional) | All cataloged resources, host instructions, and supported native advisory roles | Node.js 22+, reviewed toolkit checkout |

Neither method creates a .NET application, activates MCP, or authorizes infrastructure changes. Use one method per skill and project to avoid duplicate discovery and competing update ownership.

## One-Command Skills Installation

From your application's repository:

```bash
npx skills add https://meysamhadeli.github.io/dotnet-ai-toolkit/skills.tar.gz --copy
```

Choose the workflows and coding agents in Vercel's prompts. `--copy` avoids symlink requirements. `npx` downloads and executes the third-party CLI; review its prompts and trust policy before accepting. The current CLI requires Node.js 22.20 or later, independently of this toolkit's Node.js 22+ local installer support.

The archive is generated from canonical sources during the documentation build and becomes available when that site is deployed. Until then, use the full local installer or generate a local pack with `npm run skills:pack`. Do not install canonical `skills/` directly through Vercel: those source files intentionally reference the full installer's `.ai-toolkit/` layout. Packaged copies rewrite those routes to skill-relative `references/` and include every shared template and knowledge file.

For one skill and a specific host:

```bash
npx skills add https://meysamhadeli.github.io/dotnet-ai-toolkit/skills.tar.gz --skill dotnet-api --agent github-copilot --copy
```

Vercel agent identifiers are `github-copilot`, `claude-code`, `codex`, `cursor`, and `opencode`; these differ from the full installer's `copilot` and `claude` identifiers. Vercel currently installs most of these project skills under `.agents/skills/`, with Claude under `.claude/skills/`. Refer to its [current agent table](https://github.com/vercel-labs/skills/blob/main/docs/agents.md) rather than assuming the full installer's paths.

Use `npx skills list`, `npx skills check`, `npx skills update`, and `npx skills remove` to manage CLI-owned installations. Archive update detection depends on the installed CLI/provider version; reinstall the reviewed archive if automatic update checking is unavailable. The URL follows the deployed documentation revision, not a pinned immutable release. Review source changes before updating.

**Safety boundary:** Vercel manages its own files, conflict prompts, replacement behavior, telemetry, and symlink/copy modes. It does not inherit this toolkit installer's no-overwrite guarantee. Do not use noninteractive overwrite/update commands against an existing installation without reviewing changes. Its [configuration guide](https://github.com/vercel-labs/skills/blob/main/docs/troubleshooting.md#telemetry) documents `DISABLE_TELEMETRY` and `DO_NOT_TRACK`.

Skills-only installation does not create host instructions, receipts, or native specialist roles. It includes no executable hooks or MCP configuration. Existing application instructions remain authoritative.

## Full Local Installation

Run from a reviewed toolkit checkout with Node.js 22 or later:

```bash
node scripts/install.mjs --target "../my-dotnet-app" --assistant copilot --dry-run
node scripts/install.mjs --target "../my-dotnet-app" --assistant copilot
```

| Host | Entry point | Workflows | Specialist roles |
| --- | --- | --- | --- |
| Copilot | `.github/copilot-instructions.md` | `.github/skills/` | `.github/agents/*.agent.md` |
| Claude Code | `CLAUDE.md` | `.claude/skills/` | `.claude/agents/*.md` |
| Codex | `AGENTS.md` | `.agents/skills/` | Canonical role documents only |
| Cursor | `.cursor/rules/dotnet.mdc` | `.cursor/skills/` | Canonical role documents only |
| OpenCode | `AGENTS.md` | `.opencode/skills/` | Canonical role documents only |

All hosts receive cataloged resources under `.ai-toolkit/`, with separate `skills/`, `agents/`, `templates/`, `knowledge/`, and `mcp/`. Each installation has a deterministic receipt in `.ai-toolkit/receipts/`, including file hashes. The receipt is not an application verification result.

Host-specific entry sources live in `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, and `.github/instructions/`. The installer also places the selected host's guidance in its native folder. Claude receives its scoped rule; other hosts do not. Canonical skills and agent bodies remain at the toolkit root, not hand-copied into every host folder.

No npm dependency installation is required for this full installer. Use `node scripts/install.mjs --help` for syntax. Source and target directories must be separate; the installer does not install application templates into this toolkit itself. The rest of the host destination, receipt, and no-overwrite details in this guide apply to the full installer, not Vercel's CLI.

## Full Installer: Existing Files and Updates

All destination paths are checked before writing. Identical files remain unchanged. Any different file, directory collision, or symlink in a destination path stops installation. There is no force/overwrite option. Multiple hosts can share an identical canonical bundle, but Codex and OpenCode both use root `AGENTS.md`: merge their guidance manually when installing both.

If instructions already exist, review the selected host's source and manually merge the relevant guidance. Place needed skills and canonical resources after reviewing the dry-run destination list from a clean temporary directory. Do not delete existing instructions to make installation succeed.

This release does not merge instructions, automatically upgrade changed files, or uninstall. Review catalog/content differences and merge an update deliberately. Do not treat installer checks as a sandbox against another process concurrently modifying the target.

## First Use

Ask the assistant to use `dotnet-map-system` for one project or failing behavior. Review its project type, owner, registration path, commit boundary, nearest test, and missing prerequisites. With the full installation, start at `.ai-toolkit/templates/README.md`; with the Vercel pack, use `references/templates/README.md` relative to the selected skill's installed directory. Select the matching project type, then only relevant concepts such as validation, minimal-endpoint, persistence, or testing. Choose a task workflow such as `dotnet-add-feature-slice` or `dotnet-messaging` only when applicable.

Use `dotnet-architecture` for design choices, project-type selection, and migration tradeoffs before implementation. Use `dotnet-api` for HTTP contracts, controllers/Minimal APIs, authorization, error responses, OpenAPI, and versioning. Keep business command/query implementation with `dotnet-add-feature-slice`, new bounded contexts with `dotnet-add-service`, and published cross-consumer compatibility work with `dotnet-contracts`.

Workflow names can be referenced in plain requests. Slash-menu discovery varies by client/version; directly reference the installed `SKILL.md` when needed. Codex, Cursor, and OpenCode role guides do not imply native multi-agent support or read-only enforcement.

For manual use without installation, read the project template, relevant knowledge, and selected skill in this checkout, then explicitly provide them as context to the assistant. No files need to be copied from the reference repositories.

## Optional Integrations

Review the [MCP guide](../mcp/README.md) separately. The full installer places examples under `.ai-toolkit/mcp/` but never writes live MCP config, starts servers, or changes tool permissions. The skills-only archive does not include MCP examples or configuration. Likewise, there are no automatic lifecycle hooks or background formatters.

Installing instructions does not authorize container startup, cloud access, migration, replay, deployment, or unrestricted delegation. Existing application instructions and tool approvals remain authoritative.