# Domain Model

Use for business invariants independent of an endpoint, database mapper, or transport.

```text
<Capability>/
  Models/<Aggregate>.cs
  ValueObjects/<Value>.cs
  Exceptions/<BusinessFailure>.cs
  Features/<Action>/V1/
```

## Construction

1. State the aggregate's invariant, identity, allowed transitions, and concurrency expectations.
2. Create valid state through existing factories/constructors and behavior methods. Do not bypass them with DTO mapping or unrestricted assignments.
3. Use value objects for meaningful domain constraints, not for every primitive by default. Preserve target equality, serialization, and persistence conventions.
4. Raise domain events through the existing aggregate mechanism. Translate to public integration contracts separately; do not expose an aggregate as a broker message.
5. Keep storage/client registration outside the model. Add event sourcing only for demonstrated history/replay requirements.

## Acceptance

Pure unit tests establish valid construction, rejected invalid state, allowed/forbidden transitions, and expected domain events without external infrastructure. Provider tests separately establish mappings/concurrency. See [persistence](../persistence/README.md) and [messaging](../messaging/README.md).