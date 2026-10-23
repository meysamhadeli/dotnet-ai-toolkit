# CQRS and Request Pipelines

Use to separate write intent from query intent and trace MediatR dispatch. CQRS does not require separate databases, a broker, or event sourcing.

## Request Path

```text
endpoint/internal caller -> request -> pipeline behaviors -> handler -> result
```

1. Inspect actual `ICommand`, `IQuery`, request/result, and handler interfaces. Griffin wraps MediatR; do not replace those interfaces from memory.
2. Define one request/handler for the use case. Keep external DTOs distinct where they have different trust or compatibility requirements.
3. Register the owning assembly and all required behaviors. Inspect order and lifetimes for validation, logging, caching, transaction, and cache invalidation.
4. Ensure invalid requests do not reach side effects, queries do not accidentally open write transactions, and cached responses do not bypass authorization.
5. Keep MediatR business dispatch distinct from Wolverine transport and durable queued work. Not every command is a durable internal command.

## Acceptance

Exercise dispatch through the real pipeline, not only direct handler construction. Verify handler discovery, validation execution, commit behavior including no-event commands, and applicable caching failures. See [dependency injection](../dependency-injection/README.md) and [persistence](../persistence/README.md).