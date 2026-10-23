# Persistence and Transactions

Use for service/module/capability-owned storage, not as permission to add every store used in the references.

## Construction

1. Locate actual DbContext, entity mappings, migration owner, lifetime, and transaction behavior.
2. Trace every successful command branch through staging, event dispatch, save, and commit. In a pipeline-owned transaction, do not add a second handler save by default.
3. Test commands with and without domain events. A behavior named transaction or unit of work is not proof that every path saves/completes.
4. Preserve aggregate concurrency tokens and durable uniqueness. A pre-insert lookup does not replace a unique constraint under concurrent requests.
5. Use async/cancellation and appropriate projection/no-tracking for reads. Reuse existing repository abstractions when they carry real behavior; do not add a wrapper merely for fashion.
6. Treat PostgreSQL, MongoDB, and EventStoreDB as distinct atomicity boundaries unless proven coordinated. Event-stream append needs expected revision and historic compatibility.
7. Plan schema changes and migration execution separately. Generating a migration does not authorize applying it.

## Acceptance

Provider-backed checks cover persistence, constraints, optimistic conflict, rollback, and no-event writes. Where outgoing work is involved, prove state/outgoing enrollment together. EF InMemory and mocked DbContexts do not establish relational transaction behavior.

Compose [messaging](../messaging/README.md), [read model](../read-model/README.md), and [testing](../testing/README.md).