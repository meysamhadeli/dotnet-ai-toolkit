# Plugin Packaging

This folder owns host-specific plugin packaging guidance for the .NET AI Toolkit. It does not currently contain an installable host plugin or enable automatic discovery. Use the generated Vercel skills archive for simple skills-only adoption, or the existing [full installer](../scripts/install.mjs) for host guidance and roles. See [installation options](../docs/adoption.md).

## Skills Are Not Host Plugins

The [packager](../scripts/package-skills.mjs) generates `website/public/skills.tar.gz` from canonical sources. It bundles templates and knowledge inside each skill and adapts `.ai-toolkit/` routes to skill-relative `references/`. The website build publishes this archive; no hand-maintained capability copies live here.

Vercel's `npx skills add <archive-url> --copy` installs skills. It does not register native specialist roles, install root host instructions, or provide the full installer's conflict-refusal guarantee. Packaging tests verify deterministic archives and resource routing; live host discovery remains separate.

No `dotnet tool install` package, published toolkit npm CLI, or native Claude marketplace plugin exists in this release. A future .NET wrapper needs an actual executable and NuGet release process; documentation must not advertise a nonexistent package. Prefer the existing Node-based skills ecosystem unless a distinct user need justifies another distribution lifecycle.

## Source Boundaries

- [Skills](../skills/) and [agents](../agents/) remain canonical; do not maintain duplicate workflow bodies here.
- [Templates](../templates/README.md) and [knowledge](../knowledge/) remain shared resources, not plugin-specific copies.
- Host instructions stay in their existing host folders. Packaging must preserve role permissions and task-specific template routing.
- This README is repository-only documentation, not a cataloged asset. The installer does not copy or activate this folder.

## Add a Host Package

1. Choose the host and verify its current native plugin specification before adding manifests or packaging code. A generic `plugins/` directory is not a native registration mechanism.
2. Place host-specific packaging sources under `plugins/<host>/`. Generate package contents from canonical sources and the explicit catalog; emit any native manifest at the location required by that host.
3. Resolve resource paths deliberately. Existing skills reference `.ai-toolkit/` in an installed target; a standalone plugin cannot assume that bundle exists. Package or adapt resource routing and read-only role metadata without changing canonical task semantics.
4. Add isolated packaging tests for manifest validity, bundled resources, conditional template paths, metadata, and permissions. Preserve conflict refusal and symlink safety where packaging writes files.
5. Document explicit installation/activation, supported client versions, coexistence with the existing installer, and removal. Do not enable hooks, MCP servers, infrastructure, or publication implicitly.

No host plugin has been built, installed, published, or tested through this folder yet. Static packaging checks must not be presented as live plugin discovery results.