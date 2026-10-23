---
name: dotnet-map-system
description: "Map an existing .NET repository before implementation. Use for onboarding, service ownership, registration paths, transaction boundaries, and locating nearby tests; not for implementing a feature or choosing a new architecture."
---

# Map One Application Path

1. Read target instructions, SDK/build manifests, solution entries, and `.gitmodules` if present. Do not initialize dependencies automatically.
2. Start with the requested project, route, message, or failure. Identify library, module, application, or service boundaries before inspecting one neighboring feature.
3. Trace endpoint, MediatR request, validator, handler, aggregate, store, and actual commit owner. Record file/symbol evidence.
4. For async work, locate event mapper, Griffin/Wolverine configuration, durable store, consumer, and projection. Do not infer interfaces from package names.
5. Locate the nearest tests/fixtures and one cheap discriminating check, using the actual project type's placement.

Return owner, project type, call path, transaction owner, external contracts, nearest check, and missing prerequisites. Stay read-only and local to the requested path. Use `.ai-toolkit/templates/README.md` to select relevant concepts, not as evidence that a target has a particular architecture.

Use dotnet-architecture when the next task is choosing or changing the design, rather than documenting the existing path.

## Template Routing

Paths resolve from the target repository root. Read only matching guides before forming the plan; existing code and more specific instructions override defaults. In the toolkit checkout, use the corresponding `templates/` paths instead. If project shape is unclear, resolve it from evidence before choosing a shape guide.

- Read `.ai-toolkit/templates/README.md` when identifying the project shape and selecting relevant concepts for the requested path.
- Read `.ai-toolkit/templates/class-library/README.md` when the owner is a reusable library and public API or dependency boundaries need mapping.
- Read `.ai-toolkit/templates/modular-monolith/README.md` when one deployed host composes separate module assemblies and module-owned data.
- Read `.ai-toolkit/templates/monolith/README.md` when one host and application implementation library contain capability-local features.
- Read `.ai-toolkit/templates/web-api/README.md` when mapping an HTTP application without assuming distributed service infrastructure.
- Read `.ai-toolkit/templates/microservice/README.md` when mapping an independently deployed service and its private implementation or external contracts.