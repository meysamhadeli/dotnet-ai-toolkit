# Authoring

## Add a Capability

1. Identify a concrete .NET task and its nearest existing owner. Extend an existing skill when the procedure is the same.
2. Create `skills/dotnet-<task>/SKILL.md` with matching `name` and a quoted, specific `description` containing positive and exclusion triggers.
3. Keep the workflow bounded: prerequisites, evidence, procedure, first executable check, and honest handoff. Do not embed a general textbook.
4. Register the file with kind `skill` in the [catalog](../toolkit.json). Register every bundled resource explicitly.
5. Add positive and negative discovery examples in the [fixtures](../evals/discovery.json). Test meaningful ambiguity with neighboring workflows.
6. Update README, changelog, and affected templates or knowledge. Run `npm run check`.

Skills are loaded on demand. Keep reusable architecture guidance in `knowledge/` and project structures in `templates/`, not repeated in every skill. Describe technical procedures normally; communication styles are not part of the kit.

## Add a Role or Host

Canonical role bodies belong in `agents/`, without client-specific frontmatter. Catalog descriptions provide discovery metadata. Installer renders read/search-only tool lists for Copilot and Claude. Keep Codex roles as documents until native support is deliberately implemented and verified.

Host folders contain short entry instructions and scoped rules, not copies of the knowledge base. Use `.claude/`, `.codex/`, `.cursor/`, `.opencode/`, and `.github/instructions/`; register each installable file with kind `host` and its `assistant` in the catalog. They point to `.ai-toolkit/` resources and native skills. Any host behavior change needs a temporary-directory installation regression test.

Register project structures with kind `template`, shared guidance with kind `knowledge`, and optional MCP examples with kind `mcp`. Do not introduce separate architecture or host-abstraction folders. The structure regression ensures the requested root boundaries remain intact.

## Plugin Packaging

Use [plugins/](../plugins/README.md) for packaging guidance and future verified host-specific packaging sources. Keep workflow bodies canonical in `skills/` and `agents/`. This directory is currently repository-only and excluded from the installation catalog; do not invent a plugin asset kind or claim a generic folder enables native discovery. Implementing an actual host package requires explicit manifests, correct resource routing, installation documentation, and isolated tests.

## Add or Change a Template

Use `templates/<project-type>/README.md` for deployment/assembly layout and `templates/<concept>/README.md` for one independently selectable concern. Keep `templates/README.md` as the entry index. Do not nest reusable concepts under a sample application's name or force microservice paths on libraries/modules.

Each template needs applicability, destination/ownership where relevant, implementation procedure, acceptance checks, and links to complementary concepts. Inspect the supplied source boundary before making API claims; describe observed limitations rather than copying mistakes or asserting runtime guarantees.

Register every file in the catalog and update the index, root README, structure regression, affected host/workflow references, and changelog. Template installation is covered by temporary-directory tests; executable application behavior still needs actual target builds/tests.

## Route Templates from Skills and Roles

Every cataloged template needs at least one explicit route from a relevant existing skill and one from a relevant advisory role. Extend the workflow that owns the task; do not create one skill or agent per template or copy template content into workflows. Coverage is collective within skills and within roles, not a requirement to load every guide in each workflow.

Each skill and role has a `## Template Routing` section with bullets in this form:

```text
- Read `.ai-toolkit/templates/aspire/README.md` when the task changes AppHost resources, references, or ServiceDefaults composition.
```

Use complete paths relative to the installed target repository root and concrete task-specific conditions. In the toolkit checkout, read the corresponding `templates/` paths. Resolve the project shape from evidence, load only applicable concepts before the relevant workflow step, and preserve read-only/advisory boundaries. A route does not authorize infrastructure startup, replay, migrations, or deployment.

Roles also have a `## Handoff` section identifying evidence, assumptions, proposed checks, and the primary assistant's next workflow. Keep them advisory and read-only; never present a proposed command as an executed result.

`tests/discovery.test.mjs` checks route syntax, catalog membership, and complete template coverage separately for skills and roles. The five-host installer tests check native skill content, every canonical role's routed paths, and every generated role's name, description, read-only tools, and preserved body. Adding a template without a skill or role route fails `npm run check`. These static checks do not prove that a live assistant loads or follows a guide.

## Quality and Trust

Do not copy source, prompts, branding, screenshots, or assets from reference kits. Cite external documentation when it grounds version-specific guidance. Do not assert current package versions, license terms, or APIs without checking them.

No speculative hooks, automatic upgrades, secret-bearing configurations, or operational mutations. Every integration must state the .NET use case and its approval boundary.

Discovery fixtures check metadata coverage only. A live routing evaluation must identify host/model/version, prompt, actual selected skill, and result. Do not label deterministic fixture checks as model accuracy.