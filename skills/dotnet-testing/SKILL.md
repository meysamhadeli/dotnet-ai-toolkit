---
name: dotnet-testing
description: "Design and write focused .NET library, module, application, or service tests using existing xUnit, NSubstitute, Testcontainers, PactNet, or k6 conventions. Use for new coverage and fixture choices, not verification-only execution."
---

# Test the Failure Boundary

1. Discover tests near the owning library/module/application/service, runner, fixtures, CI commands, and container prerequisites. Match target framework/mocking library; use `.ai-toolkit/templates/testing/README.md` for test boundaries and placement.
2. Select domain unit, provider integration, HTTP, contract, end-to-end, or performance coverage according to the failure boundary.
3. Reuse builders, WebApplicationFactory, containers, and reset helpers. Keep pure domain tests infrastructure-free. EF InMemory does not prove relational constraints or transactions.
4. Add success and the relevant failure: invalid state, forbidden access, concurrency conflict, rollback, duplicate effect, or projection lag.
5. Isolate state, await async work, and use bounded eventual-consistency assertions with useful timeout diagnostics.
6. Run new/failing tests first, then the affected project. Missing Docker means blocked integration coverage, not a pass.
7. Review changed pacts/baselines. Never run load tests against unapproved shared environments.

Return established behavior, fixture reuse, command/results, and untested risks. Reuse an existing test project whenever suitable.

## Template Routing

- Read `.ai-toolkit/templates/testing/README.md` when choosing test placement, fixture scope, and the behavior boundary a test can actually establish.
- Read `.ai-toolkit/templates/validation/README.md` when distinguishing validator rule tests from pipeline execution and HTTP validation responses.
- Read `.ai-toolkit/templates/domain-model/README.md` when testing aggregate invariants, value objects, and domain event behavior without infrastructure.