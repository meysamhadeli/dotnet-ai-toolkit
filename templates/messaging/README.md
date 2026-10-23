# Messaging and Durable Work

Use only when asynchronous collaboration is required. Distributed services may use RabbitMQ; monolith/module references can use in-memory transport. Neither topology alone establishes durability.

## Distinguish Contracts

- Domain event: local aggregate fact, owned by the application model.
- Integration event: explicit public contract for another participant.
- Internal command: same-application deferred work, possibly durable through the configured queue.

## Construction

1. Identify producer, consumer, actual mapper/dispatcher, contract owner/version, stable identity, and correlation metadata.
2. Trace Griffin/Wolverine registration, transport, durable store, assembly discovery, and actual business dispatch.
3. Verify outgoing enrollment with the write transaction. Do not assume a PostgreSQL outbox atomically coordinates EventStoreDB or MongoDB.
4. Make incoming effects duplicate-safe with a durable unique identity/ledger or guarded transition in the effect transaction.
5. Define retryable versus permanent failures, poison handling, effect/ack recovery, and operator replay procedures.
6. Keep sensitive payloads out of logs and public contracts. Do not claim end-to-end exactly-once execution.

## Acceptance

Test rollback before producer commit, committed outgoing intent during broker outage, duplicate receipt, crash around effect/ack, and deployed contract compatibility using real fixtures as appropriate. Publication-observed assertions alone do not prove every downstream effect.

Replays, purges, and infrastructure startup require approval. Compose [read model](../read-model/README.md) and [testing](../testing/README.md).