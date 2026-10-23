---
name: dotnet-verify
description: "Execute focused verification of an existing .NET change using tests, API builds, contract gates, and honest blocked-check reporting. Use before handoff or to reproduce CI; not to design a new test suite."
---

# Verify the Changed Behavior

1. Read diff, target instructions, SDK/tool manifests, runner configuration, and relevant CI job.
2. Identify expected behavior and required gates. Start with the smallest failing/new test or affected API build.
3. Run commands with current prerequisites. Do not hide restore/build failures behind ignored exit codes or unjustified `--no-build`.
4. Distinguish regression, pre-existing failure, and missing prerequisite. Repair only authorized scope and rerun the same check.
5. Expand only for shared infrastructure, contracts, topology, or required CI gates.
6. Inspect final diff for accidental files, secrets, executable placeholders, and unrelated dependency changes.

Return commands/results, behavior checked, and blocked/unrun gates. Markdown checks do not prove a .NET build; mocked tests do not prove broker durability. Consult `.ai-toolkit/knowledge/verification.md` for impact checks.

## Template Routing

Use guides to select executable checks, not as substitutes for test results or authorization to start infrastructure.

- Read `.ai-toolkit/templates/testing/README.md` when choosing the narrowest test and any required impact gates for the affected behavior.
- Read `.ai-toolkit/templates/aspire/README.md` when changed AppHost resources or references require topology and readiness verification.
- Read `.ai-toolkit/templates/observability/README.md` when changed health, correlation, or telemetry behavior needs executable evidence.