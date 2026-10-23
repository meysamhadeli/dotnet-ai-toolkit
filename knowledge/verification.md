# Verification and Operations

Use the target's SDK and tool manifests. Discover actual tests near the owning library, module, application, or service; categories and runners vary. The toolkit itself is checked with `npm run check`, not `dotnet build`.

## Verification Ladder

1. Run the new or failing test for the changed behavior.
2. Build the owning library/API and affected consumers, including project references.
3. Run relevant local test projects according to the selected project type.
4. Verify contracts when another service consumes the change.
5. Run broader CI gates when shared infrastructure changes.

Command patterns below require discovered target paths:

```bash
dotnet --info
dotnet tool restore
dotnet build <owning-project.csproj>
dotnet test <test-project.csproj> --filter FullyQualifiedName~<Scenario>
dotnet format <solution> --verify-no-changes
```

Determine VSTest versus Microsoft.Testing.Platform before choosing runner-specific filters. Do not use `--no-build` or `--no-restore` without current prerequisites. Missing Docker, unavailable feeds, and absent submodule definitions are blocked checks, not passing results.

## Change Impact

| Change | Required follow-up |
| --- | --- |
| Handler/domain invariant | Validator, commit behavior, focused regression |
| Endpoint | Discovery, version, authorization, OpenAPI, named route |
| Integration event | Mapper, producer/consumer registration, compatibility, retry/duplicate test |
| Projection | Identity, ordering/checkpoint, replay, eventual consistency |
| Schema | Provider integration, migration owner, deployment/rollback plan |
| Protobuf | Both participants, generated code, deadlines, cancellation |
| New service | Solution, AppHost, gateway, health, telemetry, deployed topology, CI |
| BuildingBlocks/ServiceDefaults | All consumers and broad regression gate |

## Controlled Actions

When authorized, initialize the recorded BuildingBlocks submodule with `git submodule update --init src/BuildingBlocks`; never move its pinned revision during ordinary restore. Choose the target's Aspire or Compose topology, not both by default. Discover dashboard ports rather than assuming one.

Validate Compose using `docker compose -f <file> config --quiet` where supported. Do not print expanded secret-bearing config. Applying migrations, changing certificates, deploying Kubernetes, purging queues, replaying events, or running load tests against shared environments requires explicit authorization.

For incidents, trace one sanitized correlation/message identifier across gateway, service, broker, and projection. Distinguish liveness from readiness and business rejection from transport failure. Never include tokens or passenger payloads in reports.

Report exact commands, results, behavior established, and unrun/blocked gates. Markdown validation does not prove a .NET application's build or delivery semantics.