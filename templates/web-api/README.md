# Web API

Use for an ASP.NET Core HTTP application without assuming microservices, module projects, a broker, or separate read stores. Add separation only when the target needs it.

## Destination Shape

```text
src/<Api>/
  <Api>.csproj
  Program.cs
  Extensions/
  <Capability>/Features/<Action>/V1/
tests/<Api>.Tests/
```

For an existing nested host, preserve `src/Api/src/` or the service's API/library pair instead of relocating it. A feature library is optional for a new API; it is not mandatory layering.

## Construction

1. Read SDK, route/version policy, auth requirements, and existing endpoint conventions.
2. Keep startup focused on composition. Place business behavior in a feature handler rather than route lambdas that own transactions and domain rules.
3. Choose explicit request/response DTOs, validation, cancellation, resource authorization, bounded queries, and stable error contracts.
4. Register endpoint discovery, handlers, validators, and OpenAPI using installed-version APIs. Do not repeat deprecated calls from a reference sample.
5. Add only required persistence and external clients. Health/telemetry settings must not expose internal details or secrets.

## Acceptance

Run host build and HTTP tests proving route discovery, permitted/denied access, invalid input, expected response/location, and relevant side effects. A mediator-only test does not establish HTTP behavior.

Compose [minimal endpoint](../minimal-endpoint/README.md), [validation](../validation/README.md), [API versioning](../api-versioning/README.md), and [testing](../testing/README.md).