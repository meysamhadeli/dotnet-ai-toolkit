# Read Model and Projection

Use for a justified CQRS read side or event-stream projection. Do not add MongoDB merely because the reference uses it.

## Construction

1. Record source event/internal command, source identity, ordering/revision field, dispatch/subscription, and recovery source.
2. Define stable document identity and unique indexes. Use atomic upsert/guarded update where appropriate; check-then-insert alone races.
3. Handle duplicate, stale, missing, and out-of-order updates deliberately. Define deletion/tombstone semantics as part of ordering.
4. Document checkpoint coordination and recovery if document/checkpoint writes are not atomic.
5. For event sourcing, preserve old schema deserialization, expected revision, and deterministic replay/upcaster conventions.
6. Define acceptable lag and API read-after-write behavior. A read model is rebuildable only when a real durable source/procedure exists.

## Acceptance

Use provider-backed duplicate, newer-then-older, restart, and approved rebuild scenarios. Assert eventual state with bounded polling and useful timeout evidence, not arbitrary sleeps. Do not treat a random new document ID per delivery as business idempotency.

Persistent rebuild/replay requires authorization. See [messaging](../messaging/README.md) and [testing](../testing/README.md).