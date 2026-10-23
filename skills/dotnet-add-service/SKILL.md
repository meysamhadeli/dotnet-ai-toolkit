---
name: dotnet-add-service
description: "Create a bounded-context .NET microservice with nested API/library projects, service-local tests, Aspire, and relevant gateway wiring. Use for a new service, not a feature in an existing service."
---

# Add a Bounded Context

1. Establish invariant and data owner. Prefer an existing service if it owns the behavior. Resolve unclear ownership before scaffolding.
2. Inspect one neighboring service. Match SDK, build properties, package approvals, API/library split, registration extensions, and test names.
3. Select only required stores, async roles, and test categories. Event sourcing and MongoDB are not mandatory.
4. Create projects under `src/Services/<Service>/src/`, tests under its `tests/`, and register them in the existing solution format.
5. Implement one complete use case and focused test first. Run its test/build immediately before expanding scaffolding.
6. Wire endpoint/validator/handler discovery, known commit behavior, authorization, health, ServiceDefaults, and AppHost resource references.
7. Update gateway, Docker, deployments, and CI only where this service participates. Do not deploy or start resources implicitly.

Return files, registration chain, commands/results, and blocked prerequisites. Missing BuildingBlocks definitions must be resolved, not replaced with invented APIs. Consult `.ai-toolkit/templates/microservice/README.md` for project shape and the independent feature-slice, dependency-injection, persistence, and testing templates for relevant concepts. Do not use this workflow to create an ordinary module or class library.

## Template Routing

- Read `.ai-toolkit/templates/microservice/README.md` when ownership evidence justifies creating a new independently deployed bounded context.
- Read `.ai-toolkit/templates/aspire/README.md` when the service participates in an existing or explicitly requested AppHost and ServiceDefaults composition.
- Read `.ai-toolkit/templates/dependency-injection/README.md` when adding service registration, assembly scanning, or scoped dependencies to the composition root.
- Read `.ai-toolkit/templates/testing/README.md` when selecting local test projects and checks for the new service's first behavior.