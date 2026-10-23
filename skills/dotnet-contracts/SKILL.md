---
name: dotnet-contracts
description: "Evolve .NET HTTP, protobuf/gRPC, and integration-event contracts safely. Use for breaking API changes, schema versions, PactNet compatibility, and rolling upgrades; not delivery retries."
---

# Evolve Published Contracts

1. Locate contract ownership and all known producers/consumers. Distinguish internal records from published schemas.
2. Describe old/new producer against old/new consumer compatibility, including persisted events/messages.
3. Classify additions, removals, changed meaning, enum evolution, and route breaks. Preserve protobuf field numbers; reserve removed names/tags.
4. Prefer compatible additions. For breaks, define explicit version and staged rollout; a `V2` folder alone is insufficient.
5. Update mapping, consumers, gateway/OpenAPI or generated gRPC code, and existing PactNet artifacts as applicable.
6. Add focused compatibility tests and run them first. Review regenerated pacts/snapshots rather than accepting bulk churn.
7. Document rollout order, coexistence, historical-data treatment, and rollback limits.

Event-sourced changes require historic deserialization and replay checks. Do not rewrite history without an approved migration plan.

## Template Routing

- Read `.ai-toolkit/templates/api-versioning/README.md` when a public contract change affects route versions, compatibility, or OpenAPI documents.
- Read `.ai-toolkit/templates/minimal-endpoint/README.md` when an HTTP contract changes response status, resource location, or endpoint metadata.
- Read `.ai-toolkit/templates/messaging/README.md` when changing an integration event or internal command contract and its compatibility guarantees.