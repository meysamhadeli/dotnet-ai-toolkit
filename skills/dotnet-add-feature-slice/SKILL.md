---
name: dotnet-add-feature-slice
description: "Implement a versioned .NET command, query, or Minimal API endpoint using MediatR and existing validation/persistence. Use for one business feature inside an existing application, module, or service; not a new bounded context or HTTP pipeline/OpenAPI-only work."
---

# Implement One Use Case

1. Identify the owning project shape, then read a neighboring feature and its CQRS interfaces, validator discovery, transaction behavior, and nearest test. Consult the independent feature-slice, validation, minimal-endpoint, and testing templates under `.ai-toolkit/templates/` as needed.
2. State expected behavior, one falsifying check, and the smallest implementation.
3. Add `<Capability>/Features/<Action>/V1/`, matching casing and single-file/multi-file style. Keep DTOs, request/result, endpoint, validator, and handler local.
4. Enforce resource authorization, input validation, domain invariants, cancellation, bounded queries, response contracts, and API metadata as appropriate.
5. Preserve the verified commit boundary. Do not add a second save or direct broker publish without proving atomicity.
6. Add/update a nearby behavior test; run it immediately. Repair this slice before opening another change area.
7. Trace endpoint, handler, validators, mapper, persistence, version, and named-route registration.

Report behavior, files, focused result, and remaining gates. Use dotnet-messaging for changed async durability; do not reorganize unrelated slices.

Use dotnet-api when HTTP binding, middleware, error responses, authorization, or documentation is the controlling change rather than business-handler implementation.

## Template Routing

Read matching guides before implementing the slice, not every guide. Project shape comes from target evidence and the template catalog, never a default microservice assumption.

- Read `.ai-toolkit/templates/vertical-slice/README.md` when deciding use-case ownership and dependencies within the existing project shape.
- Read `.ai-toolkit/templates/feature-slice/README.md` when adding or changing the request-to-result layout of a concrete use case.
- Read `.ai-toolkit/templates/cqrs/README.md` when changing command/query dispatch, handlers, or request pipeline ordering.
- Read `.ai-toolkit/templates/validation/README.md` when adding input rules or changing validator discovery and execution.
- Read `.ai-toolkit/templates/minimal-endpoint/README.md` when exposing the use case through a Minimal API route or changing its HTTP semantics.
- Read `.ai-toolkit/templates/domain-model/README.md` when the use case changes aggregate invariants, value objects, or domain events.
- Read `.ai-toolkit/templates/persistence/README.md` when the use case changes queries, mappings, concurrency, or the verified commit boundary.
- Read `.ai-toolkit/templates/api-versioning/README.md` when changing a public API version, versioned route, or its OpenAPI representation.
- Read `.ai-toolkit/templates/testing/README.md` when choosing a focused check that distinguishes handler, pipeline, and actual HTTP behavior.