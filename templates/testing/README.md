# Testing

Choose the test boundary according to the behavior claimed. Reuse target xUnit, NSubstitute, FluentValidation helpers, WebApplicationFactory, Testcontainers, PactNet, and k6 only where actually present; do not impose every tool or copy version choices.

## Placement

| Project type | Nearest test home |
| --- | --- |
| Microservice | `src/Services/<Service>/tests/` |
| Modular monolith | `src/Modules/<Module>/tests/` |
| Monolith | `src/<Application>/tests/` |
| Web API / class library | Existing test project, or justified `tests/<Project>.Tests/` |

Match actual names such as `UnitTest`, `IntegrationTest`, or `Integration.Test`; do not rename neighbors to match a diagram.

## Independent Checks

- Domain unit: aggregate/value-object invariants without I/O.
- Validator unit: required fields/boundaries using deterministic request data; does not prove discovery.
- Handler unit: orchestration with existing mocks; does not prove database semantics.
- Pipeline integration: actual handler/validator/behavior resolution, invalid request rejection, commit ownership.
- Provider integration: mappings, constraints, concurrency, rollback, projection identity, and replay.
- HTTP integration: real host route/auth/version/response/location; mediator dispatch is not HTTP coverage.
- Messaging integration: outgoing enrollment, duplicate effects, retry/crash boundary, actual transport when required.
- Contract: old/new participants and persisted schema compatibility; review regenerated pacts.
- End-to-end/performance: only for real cross-boundary risks or approved load scenarios.

## Execution

Reuse existing fixtures, data builders, reset helpers, and bounded publication/projection waits. Preserve isolation, await async work, and inspect runner/platform before choosing filters. Avoid EF InMemory for relational claims, nondeterministic fake boundary values, and fixed sleeps.

Run the new/failing test immediately after the first implementation, then the affected project and required broader gates. Missing Docker/feed/submodule access is a blocked check, not a pass. Test support libraries do not count as executable tests.

Return exact commands, results, behavior established, and remaining gaps. See [verification knowledge](../../knowledge/verification.md).