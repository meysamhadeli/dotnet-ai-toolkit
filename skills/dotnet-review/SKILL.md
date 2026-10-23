---
name: dotnet-review
description: "Review .NET diffs for service coupling, authorization, persistence, contract, and messaging regressions. Use for code or architecture review without edits; use dotnet-security for a focused security audit."
---

# Review Behavior and Boundaries

Read-only unless implementation is separately requested.

1. Read the diff and nearest test/call site. Trace real ownership and registration.
2. Prioritize unauthorized access, data loss, non-atomic publication, duplicate effects, and unsafe migrations over style.
3. Check foreign implementation references/database access, invariant bypasses, commit ownership, and contract compatibility.
4. Inspect message identity, retry, projection ordering/checkpoints, and effect/ack boundaries. Challenge exactly-once claims.
5. Trace endpoint discovery, validator execution, version/auth metadata, cancellation, and errors. Check topology changes only where affected.
6. Distinguish confirmed defects from risks requiring runtime evidence and identify missing provider-backed coverage.

Return findings first by severity, with file/line, trigger, impact, and minimal repair; then assumptions/test gaps. Say explicitly when no defect is found. Do not invent findings or change files.

## Template Routing

Use matching guides as review criteria, not permission to implement changes or impose a new architecture.

- Read `.ai-toolkit/templates/README.md` when identifying the affected project shape and selecting only concepts touched by the diff.
- Read `.ai-toolkit/templates/vertical-slice/README.md` when reviewing use-case ownership, coupling, or cross-feature dependencies.
- Read `.ai-toolkit/templates/domain-model/README.md` when reviewing whether changed business invariants remain with their actual owner.