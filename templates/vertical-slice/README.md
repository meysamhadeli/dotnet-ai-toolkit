# Vertical Slice Architecture

Use to decide dependency boundaries; use the separate [feature slice](../feature-slice/README.md) template for concrete files. Vertical slices apply to microservices, modular monoliths, monoliths, and small APIs.

## Boundary Recipe

1. Identify one use case and its owning capability, aggregate, and store.
2. Group request, response, validation, dispatch, and orchestration by use case rather than global Commands/Handlers/Controllers directories.
3. Keep durable domain behavior in the capability's model and cross-cutting registration in infrastructure composition. Feature-locality does not require duplicating aggregates per endpoint.
4. Share code only for demonstrated stable behavior. Do not couple unrelated slices through a broad application service or generic repository solely to avoid a few repeated lines.
5. Preserve the project type's deployment/assembly boundaries. A module boundary is not a microservice boundary, and a folder is not a separate assembly.

```text
<Capability>/
  Models/
  ValueObjects/
  Features/
    <Action>/V1/
    <AnotherAction>/V1/
```

## Acceptance

A use-case change has one identifiable owner and nearby behavior check; unrelated slices remain untouched. Review cross-capability data access, shared contracts, dependency direction, and registration. No new infrastructure follows merely from choosing vertical slices.