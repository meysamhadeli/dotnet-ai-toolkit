# .NET Template Catalog

Choose a project shape first, then compose only the concepts needed for the change. These are original, guided implementation templates informed by the supplied application/library sources; they are not copied code, runnable scaffolds, or a `dotnet new` package. Resolve SDK versions, package APIs, registrations, and existing tests in the target before generating files.

## How Skills and Roles Use Templates

Existing skills and advisory roles contain explicit `Template Routing` sections: each path has a task-specific read condition. Mapping selects the project shape; implementation, contracts, messaging, projections, testing, and diagnostic workflows read only the concepts relevant to their task. Roles use guides to advise and return evidence/proposed checks, not to edit or execute commands. Templates stay shared here, not duplicated inside workflows or activated as directory-scoped instructions. All cataloged templates have static route coverage within skills and within roles; this does not guarantee live assistant reads. See [evaluation](../evals/README.md) for that distinction.

## Project Types

| Template | Shape and ownership |
| --- | --- |
| [Class library](class-library/README.md) | Focused reusable libraries, direct dependencies, explicit public registration APIs |
| [Modular monolith](modular-monolith/README.md) | One API/deployment, separate module projects and module-local tests |
| [Monolith](monolith/README.md) | One API/deployment and one application library with capability folders |
| [Web API](web-api/README.md) | HTTP host with only justified application/infrastructure separation |
| [Microservice](microservice/README.md) | Independently deployed bounded context with nested API/library and local tests |

Do not silently select microservices. Use existing structure; for a new application, establish deployment needs, business boundaries, and team ownership first. A class library need not have HTTP endpoints, and a monolith need not have a broker or gateway.

## Independent Concepts

| Template | Use |
| --- | --- |
| [Vertical slice architecture](vertical-slice/README.md) | Dependency and use-case boundaries |
| [Feature slice](feature-slice/README.md) | Concrete request-to-result file layout |
| [CQRS](cqrs/README.md) | Commands, queries, handlers, pipeline ordering |
| [Validation](validation/README.md) | FluentValidation rules and actual pipeline execution |
| [Minimal endpoint](minimal-endpoint/README.md) | Route discovery, dispatch, authorization, HTTP semantics |
| [Domain model](domain-model/README.md) | Aggregate invariants, value objects, domain events |
| [Persistence](persistence/README.md) | Store ownership, mappings, commit behavior, concurrency |
| [Messaging](messaging/README.md) | Integration events, internal commands, inbox/outbox |
| [Read model](read-model/README.md) | Projections, identity, ordering, replay |
| [Testing](testing/README.md) | Unit, validator, handler, HTTP, contract, and delivery checks |
| [Dependency injection](dependency-injection/README.md) | Composition, scanning, lifetimes, module registration |
| [API versioning](api-versioning/README.md) | Versioned routes, request contracts, OpenAPI |
| [Aspire](aspire/README.md) | AppHost resources, references, ServiceDefaults |
| [Observability](observability/README.md) | Health, correlation, logs, traces, metrics |

## Composition Examples

- HTTP use case: selected project type + vertical slice + feature slice + CQRS + validation + minimal endpoint + testing.
- State-changing use case: add domain model and persistence; prove the commit owner before saving or publishing.
- Asynchronous read side: add messaging and read model, including duplicate/retry/order tests.
- Reusable infrastructure: class library + dependency injection + provider/consumer tests; no artificial service host.

The microservice, modular-monolith, and monolith templates reflect different assembly/deployment boundaries in the booking references. The library template reflects Griffin's focused modules. Domain names and credentials from those sources are not bundled. See [architecture knowledge](../knowledge/architecture.md) and [verification](../knowledge/verification.md).

## Source Evidence and Limits

| Reference | Inspected boundary | Template implication |
| --- | --- | --- |
| Booking microservices | Flight create feature, validator unit test, mediator integration test | Feature-local records/endpoint/validator/handler; unit, pipeline, and HTTP claims remain distinct |
| Booking modular monolith | Shared API startup and Flight module registration/project | One deployed host, separately registered module assemblies and module-local tests |
| Booking monolith | Shared API startup, MediatR composition, application project | One implementation library with capability folders and shared pipeline composition |
| Griffin | Library guide/Core project, validation behavior, EF transaction behavior | Focused direct dependencies, explicit registration, actual validator resolution and commit-path checks |

These are source observations, not executed runtime results. In particular, inspect every transaction branch, validator composition, retry effect, and endpoint discovery path in the target; a familiar class name or copied registration is not proof of correctness.