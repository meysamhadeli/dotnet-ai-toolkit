# Validation

Use for request constraints and proof that they execute. Aggregate invariants remain in the [domain model](../domain-model/README.md); validator rules alone cannot protect non-HTTP callers.

## Construction

1. Place a validator next to the feature request. Define required fields, ranges, enum validity, and relevant cross-field constraints with clear errors.
2. Reuse the installed FluentValidation API/version and existing test helpers. Do not add web auto-validation when the application dispatches validation through MediatR.
3. Register validators from the owning assembly and verify the pipeline behavior is registered for that request type.
4. Inspect actual resolution: a behavior resolving one `IValidator<T>` does not automatically execute every validator. Make composition explicit if multiple validators are needed.
5. Check async rules, cancellation, error translation, and behavior ordering. Validation must precede state mutation; authorization/resource checks may require a separate trusted lookup.
6. Avoid treating an application-level uniqueness query as a concurrency guarantee; enforce durable uniqueness where necessary.

## Acceptance

- Rule tests check expected fields and boundary values using deterministic inputs.
- Pipeline test sends an invalid request and proves the handler/side effect is not invoked.
- HTTP test checks the target's actual validation problem response without leaking input/secrets.
- Non-HTTP command paths preserve required validation/domain protection.

A validator unit test establishes rules only, not discovery or HTTP behavior. See [testing](../testing/README.md).