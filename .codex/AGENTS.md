# .NET AI Toolkit

When maintaining the toolkit checkout without `.ai-toolkit/`, follow root `AGENTS.md`; consumer application structure does not apply to this repository.

In an installed .NET application, start at `.ai-toolkit/templates/README.md`, choose the matching project type, and load relevant independent concept templates. Read `.ai-toolkit/knowledge/architecture.md` before architecture decisions. Follow target code and more specific instructions over defaults.

Preserve existing class-library, module, application, or service boundaries and nearby test placement. Use feature-local `V1` conventions where established. Trace MediatR, validators, Griffin wrappers, transaction owner, and Wolverine durability only where used. Never impose distributed infrastructure on a library or fabricate missing APIs.

Use workflows in `.agents/skills/`. `.ai-toolkit/agents/` provides advisory role documents; this adapter does not register native Codex subagents or assume delegation is available.

Implement small tested changes and report commands/results honestly. Use target SDK/dependencies. Ask before infrastructure, submodule changes, migrations, persistent replay, and deployment. Protect secrets and personal data; require duplicate-safe effects.