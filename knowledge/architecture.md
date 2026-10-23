# Architecture

## Toolkit Versus Application

The toolkit distributes .NET development knowledge and workflows. It is not an application runtime. Its folders describe assistant capabilities; the [template catalog](../templates/README.md) separates project types from reusable concepts. No dummy solution or empty API projects are needed here.

## Choose the Correct Boundary

| Shape | Deployment/assembly boundary | Test/ownership implications |
| --- | --- | --- |
| Class library | Focused reusable project or library collection | Public contracts, registration, direct dependency ownership, consumer/provider tests |
| Modular monolith | One host, separate module projects | Module-owned data/contracts; module-local tests through shared host |
| Monolith | One host, one application implementation library | Capability folders preserve ownership without separate module assemblies |
| Web API | HTTP application with justified separation only | Real HTTP/auth/validation checks; no default broker or second store |
| Microservice | Independently deployed bounded context | Private implementation/data, local tests, explicit external contracts |

Use existing target structure. For new systems, decide from invariants, deployment needs, and ownership, not from available infrastructure. The booking sources establish concrete examples of the three application shapes; Griffin establishes focused library composition. Shared concepts do not erase these differences.

## Request and Message Paths

```text
HTTP -> gateway if present -> feature endpoint -> MediatR pipeline
     -> handler -> aggregate/store -> transaction owner -> response

Committed outgoing intent -> durable outbox -> Wolverine/RabbitMQ
     -> durable consumer -> existing business dispatch
     -> local effect/internal command -> read projection
```

These paths apply only where their dependencies exist. Trace actual code instead of assuming every target has identical middleware. A feature can keep its request, result, endpoint, validator, and handler in one file when its neighbors do. A class library may have no request pipeline or HTTP path at all.

## Critical Boundaries

EF Core handlers may stage changes while a pipeline saves after handling. An additional save can split the transaction or publish too soon. Locate the commit behavior first. Reuse existing persistence abstractions rather than adding or deleting repositories as a matter of taste.

MongoDB projections require stable source identity, unique indexes, duplicate-safe effects, ordering rules, and recovery. A check followed by insert alone is not concurrency-safe. A read model is rebuildable only when a durable replay source and procedure actually exist.

Event-sourced aggregates require expected revisions, historic schema compatibility, deterministic replay, and concurrency tests. EventStoreDB append and a relational outbox are not automatically atomic together. Document each non-atomic boundary and recovery mechanism.

Keep domain events, integration events, and local internal commands distinct. Locate actual event mappers and contract ownership. Do not impose a global Contracts project or invent a messaging adapter merely because another sample uses one.

## Operational Composition

AppHost resource references, ServiceDefaults, gateway routes, Docker build contexts, and deployment configuration form a registration chain. Add a new service to each relevant part, not to every possible deployment system. Keep secrets external.

Review instructions and workflows do not sandbox tools. Generated read-only specialist configurations restrict tools where supported; host permissions remain authoritative. No automatic lifecycle hooks, MCP process, or infrastructure starts as part of installation.

## Extending the Kit

Every new capability must support developing, testing, securing, observing, or delivering a .NET application. Avoid unrelated writing, analytics, and general-purpose plugin collections. Add another application template only with its own ownership rules and acceptance checks, not by mixing layered and microservice defaults. Keep reusable guidance here in `knowledge/` and concrete project structures in `templates/`.