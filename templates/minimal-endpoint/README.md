# Minimal Endpoint

Use for a thin ASP.NET Core route that dispatches one use case. The reference uses Griffin's `IMinimalEndpoint` discovery; retain it only when the target actually references that API.

## Endpoint Recipe

1. Put the endpoint beside its feature request/handler and map one clear route.
2. Accept an explicit DTO, map to the internal request, dispatch through MediatR, and map the result to a stable response.
3. Forward cancellation and configure authentication/resource authorization, route name, supported API version, response statuses, problem contracts, and OpenAPI metadata.
4. Use the existing discovery assembly and call the actual mapping extension at startup. Do not combine discovery with manual registration that maps the route twice.
5. For `CreatedAtRoute` semantics, ensure the referenced get-route exists and accepts the supplied route values.
6. Keep aggregate decisions, transaction commits, and broker publication out of the route delegate.

## Acceptance

Exercise HTTP through the real host: route found, anonymous/forbidden behavior, invalid body, success status/body, valid location header, cancellation/error behavior where relevant. A mediator-only integration test does not prove routing, middleware, or endpoint metadata.

Consult installed SDK documentation for version-specific OpenAPI APIs instead of copying old extension calls. Compose [validation](../validation/README.md), [API versioning](../api-versioning/README.md), and [testing](../testing/README.md).