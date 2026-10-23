---
name: dotnet-messaging
description: "Implement or audit Wolverine/RabbitMQ durable messaging with MediatR dispatch. Use for outbox, inbox, internal commands, retries, duplicate effects, and commit-to-delivery failures; not read-model ordering."
---

# Establish Durable Effects

1. Identify publisher/consumer roles and integration event versus internal command. Follow real Griffin wrappers and transport registration.
2. Locate commit owner, outgoing enrollment, durable store, consumer discovery, and business dispatch. Do not introduce a second bus.
3. State local guarantees and each non-atomic boundary, especially EventStoreDB appends or external effects outside a relational transaction.
4. Enroll outgoing work using existing transaction integration. Make incoming effects idempotent in the durable effect store, not an in-memory set.
5. Define stable identity, correlation, retryable/permanent failure, poison handling, and recovery. Never promise end-to-end exactly-once execution.
6. Add the smallest real-store/transport test for rollback, outage, duplicate delivery, or crash recovery. Run it immediately.
7. Verify event mapping, queues/exchanges, serializers, tracing, and deployed resource references.

Report what tests establish and what remains unproven. Queue purge, infrastructure startup, and persistent replay require authorization. Use dotnet-projections when document ordering/checkpoints are the controlling boundary.

## Template Routing

- Read `.ai-toolkit/templates/messaging/README.md` when changing publication, consumption, inbox/outbox enrollment, or duplicate-safe effects.
- Read `.ai-toolkit/templates/persistence/README.md` when message durability depends on the business transaction, durable store, or commit owner.
- Read `.ai-toolkit/templates/testing/README.md` when selecting provider and transport checks for retry, rollback, or duplicate delivery claims.