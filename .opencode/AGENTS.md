# .NET AI Toolkit

When maintaining the toolkit checkout without `.ai-toolkit/`, follow root `AGENTS.md`; do not apply application templates to toolkit automation.

In an installed .NET application, start at `.ai-toolkit/templates/README.md`, choose the matching project type and relevant concepts, and read `.ai-toolkit/knowledge/architecture.md`. Follow real target code and specific instructions over template defaults.

Use `.opencode/skills/` workflows and `.ai-toolkit/agents/` advisory documents. This setup installs a root `AGENTS.md` entry; it does not register native OpenCode subagents, a model provider, or an MCP server. Do not assume every client version discovers identical paths.

Preserve the target's library/module/application/service boundaries, feature-local `V1` conventions, and nearest tests. Keep actual dispatch/validation/transaction integration without adding MediatR/Griffin/Wolverine to every project. Verify commit ownership and duplicate-safe effects where applicable. Run a focused test/build immediately after editing.

Never invent missing APIs or reveal sensitive payloads. Ask before infrastructure, submodule changes, migrations, persistent replay, or deployment.