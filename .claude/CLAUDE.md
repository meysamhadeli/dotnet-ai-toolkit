# .NET AI Toolkit

When working in the toolkit checkout without `.ai-toolkit/`, follow root `AGENTS.md`; do not scaffold application services here.

In an installed .NET application, start at `.ai-toolkit/templates/README.md`. Select class-library, modular-monolith, monolith, web-api, or microservice to match the target, then load only relevant concept templates. Read `.ai-toolkit/knowledge/architecture.md` for ownership/transactions. Target code and more specific instructions override defaults.

Preserve the selected project type's assembly/deployment boundaries and test placement. Use capability-local `Features/<Action>/V1/` where established. Preserve actual MediatR and Griffin/Wolverine integration when present; do not add those dependencies to every library/API. Inspect commit boundaries before adding persistence or publication.

Workflows are in `.claude/skills/`; read-only advisory roles are in `.claude/agents/`. No plugin, automatic hook, or MCP server is required by this local installation. Discovery depends on client version.

Make one focused change, run its nearest behavior check, then expand as needed. Use target SDK/dependencies. Ask before operational mutations, submodule changes, migrations, deployment, or replay. Never expose secrets or promise end-to-end exactly-once effects.