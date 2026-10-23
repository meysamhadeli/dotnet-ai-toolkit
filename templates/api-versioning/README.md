# API Versioning and Contracts

Use when an HTTP contract has versioned behavior or compatibility requirements. A feature's `V1` folder alone does not configure an API version.

## Construction

1. Inspect installed versioning/OpenAPI packages and existing version-set/route conventions.
2. Define route, version reader, supported/deprecated versions, endpoint name, request/response DTO, and documented status/problem contracts.
3. Wire version metadata through the actual endpoint discovery path. Keep route names unique where `CreatedAtRoute` or link generation depends on them.
4. Prefer compatible additions; for breaking changes, define explicit version/coexistence and rollout rather than merely copying a feature directory.
5. Keep internal request/domain types separate from published DTOs when trust or compatibility differs. Evolve protobuf/event schemas under their own ownership/version policies.

## Acceptance

HTTP tests exercise supported/unsupported versions, route resolution, auth, status/body, and resource location. Verify generated OpenAPI matches actual routes with APIs available in the installed SDK; do not copy deprecated metadata calls blindly.

See [minimal endpoint](../minimal-endpoint/README.md) and [testing](../testing/README.md).