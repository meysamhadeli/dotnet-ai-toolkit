# Microservice

Use for an independently deployable bounded context that owns its business decisions and data. The source reference uses nested API/library projects and service-local tests; the business domain name is not part of this template.

## Destination Shape

```text
<solution>.sln or <solution>.slnx
global.json
Directory.Build.props
Directory.Build.targets
.config/dotnet-tools.json
src/
  Services/<Service>/
    Dockerfile
    src/
      <Service>.Api/
        <Service>.Api.csproj
        Program.cs
      <Service>/
        <Service>.csproj
        <Service>Root.cs
        Extensions/Infrastructure/
        Data/
        <Capability>/
          Models/
          ValueObjects/
          Dtos/
          Exceptions/
          Features/<Action>/V1/
    tests/
      tests.sln
      UnitTest/
      IntegrationTest/
      ContractTest/
      EndToEndTest/
      PerformanceTest/
      pacts/
  ApiGateway/src/
  Aspire/src/AppHost/
  Aspire/src/ServiceDefaults/
  BuildingBlocks/
deployments/
  configs/
  docker-compose/
  kubernetes/
```

Create only required test categories and operational components. A gateway, Kubernetes, event sourcing, MongoDB, and a broker are not mandatory for every service.

## Construction

1. Establish bounded context, invariant, deployment owner, contracts, and storage needs. Prefer an existing service when it owns the invariant.
2. Register API/library projects in the solution; inherit target SDK/build settings and approved direct dependencies.
3. Keep host startup thin. Implement one feature and focused test before expanding scaffolding.
4. Trace endpoint/validator/handler discovery, real Griffin wrappers if used, and commit ownership. Do not invent missing BuildingBlocks APIs.
5. Keep service implementation/database private. Exchange stable HTTP, protobuf, or event contracts, not EF entities or foreign project references.
6. Wire relevant AppHost resources, ServiceDefaults, gateway routes, Docker context, deployment topology, and CI without launching or deploying them.

## Acceptance

Build API and library; run nearest service-local tests, HTTP authorization checks, provider tests, and compatibility tests where affected. For messages, test durable intent, duplicate-safe effects, and failure recovery. Multiple services/stores do not share a transaction by assumption.

Compose [vertical slice](../vertical-slice/README.md), [feature slice](../feature-slice/README.md), [messaging](../messaging/README.md), and [testing](../testing/README.md). Initialize or update a BuildingBlocks submodule only when authorized.