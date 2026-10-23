---
description: "Apply toolkit guidance to .NET application code, not toolkit automation."
applyTo: "**/*.cs,**/*.csproj"
---

# .NET AI Toolkit

When maintaining the toolkit checkout without `.ai-toolkit/`, follow root `AGENTS.md`; do not create application services here.

In an installed .NET application, start at `.ai-toolkit/templates/README.md`. Select the matching project type and relevant independent concepts, then read `.ai-toolkit/knowledge/architecture.md` for boundary decisions. Existing code and more specific instructions override template defaults.

Preserve the target's library/module/application/service boundaries, feature-local `V1` conventions, and nearest tests. Trace actual dispatch, validation, and commit behavior. Keep MediatR and Griffin/Wolverine where used, not as mandatory dependencies for every project. Never invent shared APIs or access another owner's implementation/data without an explicit contract.

Use task-specific `.github/skills/` workflows. `.github/agents/` contains read/search-only advisory roles. Make a small change and run the nearest discriminating test/build immediately.

Use target SDK/package manifests, fixtures, and CI. Ask before infrastructure, submodule changes, migrations, persistent replay, and deployment. Protect credentials and personal data. Assume duplicate delivery; require idempotent durable effects.