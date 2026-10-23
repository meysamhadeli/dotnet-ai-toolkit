---
name: dotnet-debug
description: "Diagnose .NET runtime/startup failures across YARP, Aspire, gRPC, EF Core, Wolverine, RabbitMQ, MongoDB, and telemetry. Use for a failing path or incident, not a general code review."
---

# Investigate One Failing Path

1. Capture symptom, environment, recent change, failing request/command, and sanitized correlation identity. Never request secrets or full personal payloads.
2. Select the nearest controlling boundary: route, auth, handler/transaction, resource readiness, transport, or projection.
3. Form one falsifiable hypothesis and cheap discriminating check. Read only code/configuration controlling that boundary.
4. Distinguish infrastructure availability, registration error, business rejection, and transient failure. Liveness does not imply readiness.
5. If code repair is authorized, make a small change and rerun the discriminating check immediately. Otherwise return diagnosis without edits.
6. For async failures, follow commit, dispatch, receive, effect, and projection separately. Retry does not prove idempotency.

Return evidence, cause or remaining uncertainty, check result, and proposed recovery. Do not restart shared resources, purge queues, migrate, or deploy without approval.

## Template Routing

- Read `.ai-toolkit/templates/aspire/README.md` when startup or readiness failure involves AppHost resources, references, endpoints, or ServiceDefaults.
- Read `.ai-toolkit/templates/dependency-injection/README.md` when a failure involves registration, assembly scanning, dependency resolution, or service lifetimes.
- Read `.ai-toolkit/templates/observability/README.md` when diagnosing missing health signals, correlation, logs, traces, or metrics along the failing path.