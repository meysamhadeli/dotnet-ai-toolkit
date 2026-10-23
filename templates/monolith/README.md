# Monolith

Use for one deployable with one application implementation assembly. Capability folders organize business ownership without claiming separate module assemblies or service deployments.

## Destination Shape

```text
src/
  Api/src/
    Api.csproj
    Program.cs
    Extensions/
      SharedInfrastructureExtensions.cs
      MediatRExtensions.cs
  <Application>/src/
    <Application>.csproj
    <Application>Root.cs
    <Capability>/
      <Capability>Root.cs
      Data/
      <Entities>/
        Models/
        ValueObjects/
        Features/<Action>/V1/
  <Application>/tests/
    Integration.Test/
  Aspire/src/AppHost/
  Aspire/src/ServiceDefaults/
  BuildingBlocks/
deployments/docker-compose/
```

`<Application>/src/` contains all capabilities in one library, as distinct from a modular monolith's separate module projects. Preserve existing Dockerfile/build contexts rather than assuming the API directory owns them.

## Construction

1. Keep API startup thin; shared extensions configure application scanning and middleware.
2. Group use cases inside capability folders and preserve aggregate/data ownership even though assembly references cannot enforce it.
3. Register handlers, validators, mappings, and endpoints for the actual application assembly. Do not add a project for each entity to imitate modules.
4. Identify the DbContext/transaction owner used by each request. A single process can still use multiple non-atomic stores.
5. Keep internal collaboration explicit. Do not introduce a broker, gRPC hop, gateway, or distributed contract package for an ordinary in-process call.
6. Test through the shared host and existing application-local fixtures. Add unit/HTTP/contract tests only where they address real risks.

## Acceptance

Build API/application library, verify handler and validator discovery, test an authorized endpoint and relevant persistence effect, and check capability boundaries in review. Do not infer exactly-once effects from an in-memory transport.

Compose [feature slice](../feature-slice/README.md), [CQRS](../cqrs/README.md), [validation](../validation/README.md), and [testing](../testing/README.md).