# Modular Monolith

Use for one deployed application with explicit module assembly boundaries. The reference composes modules in one API host; modules are not separately deployed microservices.

## Destination Shape

```text
src/
  Api/
    Dockerfile
    src/
      Api.csproj
      Program.cs
      Extensions/SharedInfrastructureExtensions.cs
  Modules/<Module>/src/
    <Module>.csproj
    <Module>Root.cs
    Extensions/Infrastructure/
    Data/
    <Capability>/Features/<Action>/V1/
  Modules/<Module>/tests/
    Integration.Test/
  Aspire/src/AppHost/
  Aspire/src/ServiceDefaults/
  BuildingBlocks/
deployments/docker-compose/
```

`Modules/<Module>/src/` is the module project itself, not a nested `<Module>.Api` pair. Match existing module-local test names; add other test categories only for real scenarios.

## Composition

1. Host configures shared infrastructure once and explicitly registers each participating module.
2. Each module registers its endpoint assembly, validators, mappings, persistence, and request handlers. Preserve actual `Add...Modules`/`Use...Modules` conventions where present; these names are not universal APIs.
3. Host composes authentication/authorization, shared middleware, module middleware, and endpoint mapping in a verified order.
4. Keep module internals behind owned contracts. Shared process/database infrastructure does not authorize direct writes into another module's tables or collections.
5. Resolve transaction behavior and DbContext per use case/module. Multiple registrations of the same shared interface can silently select the wrong module store; test resolution through the real host.
6. Internal messaging can use in-process transport when configured. It is not automatically durable or atomically coordinated across module stores.

## Acceptance

Build the shared host and affected module, resolve registrations, exercise a module endpoint through the host, and verify cross-module contract behavior where changed. One deployable does not imply one transaction across all stores.

Compose [vertical slice](../vertical-slice/README.md), [dependency injection](../dependency-injection/README.md), [persistence](../persistence/README.md), and [testing](../testing/README.md). Add [messaging](../messaging/README.md) only when required.