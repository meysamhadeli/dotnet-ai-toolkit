---
paths:
  - "**/*.cs"
  - "**/*.csproj"
---

# .NET Application Work

Use the installed `.ai-toolkit/knowledge/architecture.md` and `.ai-toolkit/knowledge/verification.md` for ownership and verification. Start with `.ai-toolkit/templates/README.md`, choose the matching project shape, and load only relevant concepts such as validation, minimal-endpoint, persistence, or testing.

Preserve actual dispatch, validation, and transaction ownership. Keep MediatR/Griffin/Wolverine where used without imposing them on every project type. Do not invent APIs, promise exactly-once effects, or expose credentials/personal data. Run the nearest meaningful test after a change.

If these installed resources are absent because this is the toolkit checkout, use root maintainer instructions instead.