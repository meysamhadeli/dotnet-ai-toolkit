# Feature Slice

Use to implement one command/query or HTTP use case inside the selected project shape.

```text
<Capability>/Features/<Action>/V1/
  <Action>.cs
```

The reference co-locates DTOs, command/result, validator, endpoint, and handler. Match that single-file style or an existing split-file convention; do not invent a new layout for one change.

## Fill the Slice

| Element | Responsibility |
| --- | --- |
| Request DTO | External input; exclude server-owned or privileged fields |
| Command/query | Internal intent using the target's actual CQRS interface |
| Result/response | Stable output without tracked entities or sensitive fields |
| Validator | Input constraints, actually registered and executed |
| Endpoint | Route/auth/version/HTTP metadata and dispatch |
| Handler | One business operation, cancellation, known commit boundary |
| Mapping | Existing mapper or explicit translation |

1. State expected behavior and one check that could disprove it.
2. Implement domain interaction and handler using actual dependencies.
3. Add endpoint/validator registration where required; compilation alone is insufficient.
4. Add/update the nearest test and run it immediately before adjacent edits.

Queries choose their data source explicitly, authorize access, bound pagination, and define not-found/consistency behavior. Commands stage changes and let the verified transaction owner commit. See [CQRS](../cqrs/README.md), [validation](../validation/README.md), and [minimal endpoint](../minimal-endpoint/README.md).