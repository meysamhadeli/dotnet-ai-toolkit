# Aspire Composition

Use for local orchestration when the target already uses Aspire or explicitly requests it. Aspire is not authorization to launch infrastructure or deploy.

```text
src/Aspire/src/
  AppHost/
  ServiceDefaults/
```

## Construction

1. Inspect actual AppHost resource names, service project references, provider package versions, and launch profiles.
2. Add only required database/broker/cache resources and pass references using the established configuration convention.
3. Compose independently deployed services separately; compose a monolith/modular-monolith API as one application process, not fictitious per-module hosts.
4. Keep ServiceDefaults focused on health, telemetry, discovery, and resilience. Domain rules and storage schemas remain application-owned.
5. Coordinate ports, readiness, dependencies, and local secrets without hardcoding credentials or assuming dashboard addresses.

## Acceptance

Build AppHost and affected application projects. When startup is authorized, verify actual resource readiness and the service's configuration resolution. Do not run Aspire and Compose topologies together by default or treat an AppHost build as runtime health evidence.

See [observability](../observability/README.md) and [verification knowledge](../../knowledge/verification.md).