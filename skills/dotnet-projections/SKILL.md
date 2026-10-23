---
name: dotnet-projections
description: "Build or repair .NET CQRS MongoDB read projections and EventStoreDB replay paths. Use for stale read models, duplicate/stale events, stream revisions, checkpoints, and eventual consistency."
---

# Project State Safely

1. Identify source events, source identity/revision, dispatch path, projection handler, collection, and recovery source.
2. Distinguish durable internal commands from event-stream subscriptions. Read actual retry and checkpoint behavior.
3. Use stable source identity and unique indexes. Prefer atomic upsert/guarded updates where appropriate; check-then-insert alone is not concurrency-safe.
4. Define duplicate, stale, missing, and out-of-order handling. Explain crash recovery when document updates and checkpoints cannot commit atomically.
5. For event sourcing, test expected revisions, old schema deserialization, and deterministic replay.
6. Add provider-backed duplicate, newer-then-older, restart, or empty-store replay tests for the changed risk. Run the focused check immediately.
7. Assert eventual state with bounded polling through existing helpers, not arbitrary sleeps. State read-after-write expectations and allowed lag.

Rebuild/replay is an operational mutation; provide a plan and obtain approval before applying it to persistent environments.

## Template Routing

- Read `.ai-toolkit/templates/read-model/README.md` when changing projection identity, ordering, checkpoints, staleness, or rebuild behavior.
- Read `.ai-toolkit/templates/messaging/README.md` when projection correctness depends on message delivery, retries, or duplicate handling.
- Read `.ai-toolkit/templates/persistence/README.md` when changing provider-specific projection updates, concurrency controls, or checkpoint commits.