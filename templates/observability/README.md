# Observability and Health

Use for diagnosing real .NET request/message paths without exposing secrets or personal data. Select the target's existing telemetry stack, not every exporter in the reference diagrams.

## Construction

1. Trace one sanitized correlation/message identity through HTTP, MediatR, persistence, transport, and projection as applicable.
2. Preserve structured logs and useful trace context across process/queue boundaries. Do not serialize arbitrary requests, tokens, passenger records, or connection strings into telemetry.
3. Distinguish liveness from readiness. Add dependency checks only where they represent actual ability to serve traffic, with bounded timeouts.
4. Keep metric labels bounded; avoid per-user, per-request, or message-identity labels that create unbounded cardinality.
5. Configure collectors/exporters through reviewed environment configuration. Do not embed credentials in instruction/example files.

## Acceptance

Under an authorized test environment, correlate one request/message, observe a meaningful failed-dependency state, and verify redaction. Missing telemetry is not proof a business effect did not occur; reconcile with the owning durable store.

See [Aspire](../aspire/README.md), [messaging](../messaging/README.md), and [testing](../testing/README.md).