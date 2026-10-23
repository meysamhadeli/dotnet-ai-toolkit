# Dependency Injection and Composition

Use for host/module/library registration, assembly scanning, middleware composition, and service lifetime decisions.

## Construction

1. Locate the composition root, assembly marker, and owning registration extension.
2. Register only participating assemblies for endpoints, MediatR handlers, validators, and mappings. Broad scanning can discover unrelated handlers or duplicates.
3. Keep module infrastructure explicit and shared infrastructure registered once in modular monoliths. In a monolith, scan the actual application library rather than inventing module projects.
4. Make provider/DbContext selection and lifetimes explicit. Review duplicate registrations, scoped dependencies captured by singletons, and module stores hidden behind the same interface.
5. Keep middleware order deliberate: authentication/authorization, exception translation, endpoint mapping, and operational defaults must work through the real host.
6. For libraries, expose registration in the owning public extension and avoid side effects at registration time.

## Acceptance

Construct the real service provider/host with validation where appropriate, resolve representative requests, and exercise a registered endpoint. Test that invalid requests reach the intended validator and writes resolve the correct store. A class existing in the assembly does not establish registration.

Compose [CQRS](../cqrs/README.md), [minimal endpoint](../minimal-endpoint/README.md), and [testing](../testing/README.md).