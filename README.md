<div align="center">

# dotnet-ai-toolkit

**Give your AI assistant a grounded workflow for .NET development.**

Map ownership. Build focused features. Verify real behavior.
Across GitHub Copilot, Claude Code, Codex, Cursor, and OpenCode.

[![Validate toolkit](https://github.com/meysamhadeli/dotnet-ai-toolkit/actions/workflows/ci.yml/badge.svg)](https://github.com/meysamhadeli/dotnet-ai-toolkit/actions/workflows/ci.yml)
[![Documentation](https://img.shields.io/badge/docs-Nextra-7c3aed)](https://meysamhadeli.github.io/dotnet-ai-toolkit/)
[![Node.js](https://img.shields.io/badge/Node.js-22%2B-43853d)](package.json)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

**14 workflows · 4 advisory roles · 5 project shapes · 14 reusable concepts**

[Documentation](https://meysamhadeli.github.io/dotnet-ai-toolkit/) · [Quick start](#quick-start) · [Workflows](#choose-a-workflow) · [Templates](#choose-your-project-shape) · [Contributing](CONTRIBUTING.md)

</div>

---

## Why this toolkit?

AI-generated .NET code can look convincing while missing the boundary that matters: who owns the data, where a transaction commits, whether validation actually runs, or which test exercises the changed path.

dotnet-ai-toolkit gives assistants **task-specific workflows and shared architecture guidance**, grounded in your repository rather than a universal service scaffold.

- **Start with evidence.** Locate the owning library, module, application, or service before editing.
- **Keep architecture proportional.** A class library does not need a web host; a monolith does not need a message broker.
- **Build complete changes.** Connect registration, validation, contracts, persistence, and tests where the task requires them.
- **Verify honestly.** Separate executed checks from recommendations, blocked gates, and unverified runtime claims.
- **Keep you in control.** Review skills installation; the full installer refuses overwrites. No automatic hooks, MCP activation, or infrastructure changes.

This is an instruction and knowledge toolkit, not a .NET runtime, `dotnet new` package, or native marketplace plugin.

## Quick start

### Recommended: install skills with Vercel

Requires **Node.js 22.20 or later** for Vercel's `skills` CLI. Run one command **inside your .NET project**, then choose your skills and assistant:

```bash
npx skills add https://meysamhadeli.github.io/dotnet-ai-toolkit/skills.tar.gz --copy
```

No clone, global install, or .NET SDK required. `npx` downloads and runs Vercel's CLI. Each skill includes its own templates and knowledge; it does not need a separate `.ai-toolkit/` folder.

**Availability:** the archive is generated and published with the documentation website. Until that Pages deployment is live, use the full local installer below. Do not use `npx skills add meysamhadeli/dotnet-ai-toolkit` directly: canonical repository skills depend on the full toolkit's shared resource paths.

Skills-only installation does **not** add host instructions or specialist agents. Review the CLI's prompts and existing skills before accepting; its update/overwrite behavior is separate from the full installer's no-overwrite contract. See [installation options](docs/adoption.md).

### Optional: install the full toolkit

Want host instructions and read-only specialist roles too? Use the full installer from a reviewed checkout. Requires Node.js 22+; no npm dependency installation needed.

```bash
git clone https://github.com/meysamhadeli/dotnet-ai-toolkit.git
cd dotnet-ai-toolkit
node scripts/install.mjs --target "../my-dotnet-app" --assistant copilot --dry-run
node scripts/install.mjs --target "../my-dotnet-app" --assistant copilot
```

The target must be an existing, separate application repository. Replace `copilot` with `claude`, `codex`, `cursor`, or `opencode`. Different existing files, directory collisions, and symlinked destinations stop installation; identical files are reused. There is no force-overwrite option.

Choose one installation method per skill and project. Do not layer Vercel-managed skills over a full toolkit installation without reviewing duplicate discovery and ownership. Already have AI instructions? Read [adoption and manual merging](docs/adoption.md).

### Start with one real task

Open your application in the selected assistant and ask:

```text
Use dotnet-map-system to identify this project's shape, the owner of
this behavior, its registration and commit boundaries, and the nearest test.
```

Then choose the relevant workflow:

```text
Use dotnet-add-feature-slice to add this use case using the owning
project's conventions. Wire validation and registration, then run
the smallest test that proves the behavior.
```

Reference workflow names in normal requests. Slash-menu discovery depends on the client and version; directly reference the installed `SKILL.md` if needed.

## Bring your assistant

The Vercel CLI selects agent destinations for skills-only installation. The following table describes the **optional full installer**, which also renders host guidance and role metadata:

| Assistant | Native guidance | Workflows | Specialist roles |
| --- | --- | --- | --- |
| GitHub Copilot | `.github/copilot-instructions.md` | `.github/skills/` | Read/search-only native agents |
| Claude Code | `CLAUDE.md`, `.claude/rules/` | `.claude/skills/` | Read/search-only native agents |
| Codex | `AGENTS.md` | `.agents/skills/` | Advisory documents |
| Cursor | `.cursor/rules/dotnet.mdc` | `.cursor/skills/` | Advisory documents |
| OpenCode | `AGENTS.md` | `.opencode/skills/` | Advisory documents |

All hosts receive shared resources under `.ai-toolkit/` and a deterministic installation receipt. Codex and OpenCode share the root `AGENTS.md` destination; merge guidance manually when using both. Advisory documents do not imply native role registration or enforced permissions.

## Choose a workflow

### Understand and design

| Workflow | Use it to |
| --- | --- |
| [dotnet-map-system](skills/dotnet-map-system/SKILL.md) | Trace ownership, registration, commit boundaries, and tests |
| [dotnet-architecture](skills/dotnet-architecture/SKILL.md) | Choose project shape, dependencies, and migration tradeoffs |
| [dotnet-library-docs](skills/dotnet-library-docs/SKILL.md) | Check API choices against versioned library documentation |

### Build and evolve

| Workflow | Use it to |
| --- | --- |
| [dotnet-add-service](skills/dotnet-add-service/SKILL.md) | Add a bounded context and composition wiring |
| [dotnet-add-feature-slice](skills/dotnet-add-feature-slice/SKILL.md) | Implement a versioned command, query, or endpoint |
| [dotnet-api](skills/dotnet-api/SKILL.md) | Connect HTTP semantics, authorization, errors, OpenAPI, and versioning |
| [dotnet-contracts](skills/dotnet-contracts/SKILL.md) | Evolve HTTP, protobuf, and event schemas safely |
| [dotnet-messaging](skills/dotnet-messaging/SKILL.md) | Design durable delivery and duplicate-safe effects |
| [dotnet-projections](skills/dotnet-projections/SKILL.md) | Handle read models, ordering, checkpoints, and replay |

### Test, diagnose, and review

| Workflow | Use it to |
| --- | --- |
| [dotnet-testing](skills/dotnet-testing/SKILL.md) | Write focused tests near the owning component |
| [dotnet-debug](skills/dotnet-debug/SKILL.md) | Diagnose one failing distributed path |
| [dotnet-review](skills/dotnet-review/SKILL.md) | Review behavioral and boundary regressions |
| [dotnet-verify](skills/dotnet-verify/SKILL.md) | Run relevant checks and report blocked gates |
| [dotnet-security](skills/dotnet-security/SKILL.md) | Audit application trust boundaries and data exposure |

## Specialist advice, not unchecked autonomy

Four roles return inspected evidence, assumptions, applicable guides, and proposed checks to the primary assistant:

- [Service designer](agents/dotnet-service-designer.md): architecture, ownership, contracts, and composition.
- [Boundary reviewer](agents/dotnet-boundary-reviewer.md): ownership, authorization, persistence, and messaging risks.
- [Test strategist](agents/dotnet-test-strategist.md): regression coverage near the changed behavior.
- [Incident investigator](agents/dotnet-incident-investigator.md): startup, readiness, delivery failures, and projection lag.

Roles advise; the primary assistant owns edits, executable validation, and approval requests. A proposed command is not a test result.

## Choose your project shape

Start with the [template catalog](templates/README.md), then load only the concepts relevant to your task.

| Project type | Fits |
| --- | --- |
| [Class library](templates/class-library/README.md) | Reusable packages, explicit public APIs, direct dependencies |
| [Modular monolith](templates/modular-monolith/README.md) | One deployment with separately owned module assemblies |
| [Monolith](templates/monolith/README.md) | One application library organized by capability |
| [Web API](templates/web-api/README.md) | An HTTP host with only justified separation |
| [Microservice](templates/microservice/README.md) | An independently deployed bounded context |

**Compose independent concepts:** [vertical slice](templates/vertical-slice/README.md), [feature slice](templates/feature-slice/README.md), [CQRS](templates/cqrs/README.md), [validation](templates/validation/README.md), [minimal endpoint](templates/minimal-endpoint/README.md), [domain model](templates/domain-model/README.md), [persistence](templates/persistence/README.md), [messaging](templates/messaging/README.md), [read model](templates/read-model/README.md), [testing](templates/testing/README.md), [dependency injection](templates/dependency-injection/README.md), [API versioning](templates/api-versioning/README.md), [Aspire](templates/aspire/README.md), and [observability](templates/observability/README.md).

Templates are guided structures and implementation recipes, not runnable scaffolds. Existing target conventions take precedence. Skills and roles contain conditional template routes; automated coverage does not prove live assistant selection.

## Documentation

| Start here | What you will find |
| --- | --- |
| [Documentation website](https://meysamhadeli.github.io/dotnet-ai-toolkit/) | Searchable guides, workflows, roles, and template reference |
| [Adoption](docs/adoption.md) | Installation, host destinations, updates, and first use |
| [Architecture](knowledge/architecture.md) | Ownership, boundaries, and project-shape reasoning |
| [Verification](knowledge/verification.md) | Evidence and meaningful acceptance checks |
| [MCP integrations](mcp/README.md) | Opt-in documentation lookup and approval boundaries |
| [Authoring](docs/authoring.md) | Extend canonical workflows, roles, and templates |
| [Website maintenance](docs/website.md) | Nextra development, static builds, and GitHub Pages publication |

Optional MCP examples are never activated automatically. [Plugin packaging](plugins/README.md) explains distribution boundaries. No native Claude marketplace plugin, `dotnet tool install` package, or published toolkit npm installer exists in this release; the Vercel skill pack is not a host plugin.

## Repository map

```text
skills/        Canonical task workflows
agents/        Canonical advisory roles
templates/     Five project shapes and independent concepts
knowledge/     Shared architecture and verification guidance
toolkit.json   Explicit installation catalog
scripts/       Dependency-free toolkit automation
tests/         Structure, discovery, validation, and installer checks
evals/         Positive and negative discovery fixtures
mcp/           Opt-in documentation server examples
docs/          Adoption and maintainer guides
website/       Nextra documentation app (separate npm package)
plugins/       Repository-only packaging guidance
```

Host entry guidance lives in `.github/`, `.claude/`, `.codex/`, `.cursor/`, and `.opencode/`. Installed native files are rendered by the installer into a separate repository; canonical sources stay here.

## Verification and contributing

```bash
npm run check
```

The dependency-free toolkit gate checks catalog coverage, local links, JSON, metadata, template routes, discovery fixtures, and temporary-directory installs. CI covers Windows/Linux and Node.js 22/24. These checks do **not** prove live assistant behavior or target .NET runtime correctness.

The Nextra website has its own dependencies and static build. See [website maintenance](docs/website.md) for exact commands and deployment prerequisites.

Contributions welcome: read [contribution guidelines](CONTRIBUTING.md), [authoring rules](docs/authoring.md), and [evaluation scope](evals/README.md). [Release Drafter](.github/workflows/release-drafter.yml) prepares unpublished notes; release publication remains manual.

## Inspiration and license

The presentation and organization of [dotnet-claude-kit](https://github.com/codewithmukesh/dotnet-claude-kit) informed this toolkit's structure. Additional packaging and evaluation ideas came from agent-skills, dotnet-artisan, and agents. All bundled instructions, workflows, scripts, templates, and website design are original; reference prompts, code, branding, screenshots, and media are not copied.

Supplied application and library references inform structural guidance, not runtime dependencies or tested guarantees.

[MIT licensed](LICENSE).
