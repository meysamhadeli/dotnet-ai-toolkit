# Class Library

Use for reusable .NET functionality or infrastructure integration, not a hosted service. Griffin provides the structural reference: focused projects with direct dependencies and explicit registration entry points.

## Destination Shape

```text
<solution>.slnx or <solution>.sln
Directory.Build.props
src/<Library>/
  <Library>.csproj
  Extensions.cs
  <PublicContract>.cs
  <Implementation>.cs
tests/<Library>.Tests/
  <Library>.Tests.csproj
```

For a collection, repeat `src/<Library>/` for focused libraries such as core abstractions, persistence, validation, or transport. Tests shown are proposed destinations when tests are needed, not a claim that Griffin currently has executable test projects.

## Construction

1. State the public capability, consumer, supported framework, and compatibility policy.
2. Keep package references in the project directly using them. Reference another library only for APIs consumed; do not add a catch-all dependencies project.
3. Put public registration in the owning `Extensions.cs` or equivalent. Keep implementation details internal where possible and configuration/lifetimes explicit.
4. Separate neutral contracts from optional provider integrations where actual dependency pressure justifies it. Do not mechanically reproduce every Griffin module or its framework references.
5. Add focused API/behavior tests and provider-backed integration where relevant. A TestBase support library is not an executable test suite.
6. Update solution entries and package documentation. Pack/publish only when requested; inspect versioning and licensing first.

## Acceptance

- Owning library and affected consumers compile against actual APIs.
- Public registration resolves required services with correct lifetimes.
- No startup, migration, network connection, or deployment occurs merely by referencing the package.
- A behavioral test covers the public contract; use consumer integration when no local runner exists.

Compose [dependency injection](../dependency-injection/README.md), [testing](../testing/README.md), and only the integration concepts this library implements.