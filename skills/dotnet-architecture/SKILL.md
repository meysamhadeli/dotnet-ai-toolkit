---
name: dotnet-architecture
description: "Plan .NET architecture, project-type selection, ownership, dependency boundaries, and migration tradeoffs. Use for choosing or changing design across class libraries, modular monoliths, monoliths, web APIs, and microservices; not repository mapping, code review, or unapproved structural edits."
---

# Choose an Architecture from Evidence

1. Read target instructions, actual project references, composition roots, data/transaction ownership, and one relevant capability with its nearest tests. Use dotnet-map-system when the existing path is unknown; do not map the entire repository by default.
2. Establish the decision, constraints, invariants, deployment independence, expected change, and operational requirements. For a new project, resolve unknown requirements before prescribing a shape. Existing working boundaries are the baseline, not something to replace automatically.
3. Select matching project-type and concept guides below. Compare the current/minimal option with justified alternatives, including dependency direction, public contracts, testability, failure modes, and migration cost. Do not force layered projects, MediatR, brokers, separate stores, or distributed deployments into every design.
4. State the proposed assembly/deployment boundaries, capability owners, allowed references, registration paths, and data/commit owners. Distinguish library APIs, module contracts, HTTP contracts, domain events, and integration messages. Never invent shared APIs or claim automatic cross-store atomicity.
5. For a structural change, outline reversible increments, compatibility requirements, and one discriminating acceptance check per meaningful boundary. Prefer actual project-reference, provider, HTTP, or contract checks to folder-name assertions. Proposed commands are not executed results.
6. Return a decision record in the response: inspected evidence, requirements, options/tradeoffs, recommendation, affected paths, assumptions, rollout risks, and verification plan. Write an ADR only when requested and in the target's existing documentation convention.

Planning is read-only by default. Do not scaffold, reorganize projects, change dependencies, migrate data, or start infrastructure as part of choosing a design. Hand implementation to the primary assistant after the design is accepted: dotnet-add-service for a new bounded context, dotnet-add-feature-slice for a business use case, or dotnet-api for HTTP surface work. Other library/module changes follow the target's existing workflow; do not pretend a service workflow fits every project.

## Template Routing

Paths resolve from the installed target repository root; in the toolkit checkout use corresponding `templates/` paths. Read only matching guides before deciding; target evidence and more specific instructions override defaults.

- Read `.ai-toolkit/templates/README.md` when selecting the project type and concepts for the architecture decision.
- Read `.ai-toolkit/templates/class-library/README.md` when deciding reusable public API, package, dependency, or consumer registration boundaries.
- Read `.ai-toolkit/templates/modular-monolith/README.md` when comparing or preserving separate module assemblies within one deployment.
- Read `.ai-toolkit/templates/monolith/README.md` when evaluating one host and one application implementation library with capability-local features.
- Read `.ai-toolkit/templates/web-api/README.md` when deciding the minimum justified structure for an HTTP application.
- Read `.ai-toolkit/templates/microservice/README.md` when independent ownership and deployment are requirements rather than assumed defaults.
- Read `.ai-toolkit/templates/vertical-slice/README.md` when deciding use-case boundaries and dependency direction within the selected project type.
- Read `.ai-toolkit/templates/persistence/README.md` when the design changes data ownership, commit boundaries, concurrency, or store topology.
- Read `.ai-toolkit/templates/messaging/README.md` when comparing synchronous contracts with asynchronous delivery, compensation, and durability needs.
- Read `.ai-toolkit/templates/dependency-injection/README.md` when the design changes module composition, registration APIs, or dependency lifetimes.