---
name: dotnet-api
description: "Design and implement ASP.NET Core HTTP APIs, controllers or Minimal APIs, OpenAPI metadata, ProblemDetails, authorization, and versioning. Use for API surface and HTTP pipeline changes; not business-handler implementation, gRPC/event schema evolution, or creating a new service."
---

# Implement an HTTP Boundary

1. Inspect target instructions, SDK/packages, one neighboring endpoint or controller, host composition, authorization policies, error handling, and nearest HTTP test fixture. Preserve the actual project shape and HTTP style. Do not introduce controllers, endpoint frameworks, MediatR, or new documentation packages simply to match a template.
2. Define the smallest HTTP behavior to change: method/route, binding and request DTO, caller/resource authorization, success/error status and body, headers, cancellation, and version compatibility. Use dotnet-contracts when published consumers or rolling compatibility control the work; use dotnet-add-feature-slice when implementing the underlying business command/query is the main task.
3. Select the relevant guides below and state one falsifying HTTP check. Follow existing dispatch and mapping. Keep domain invariants and commit ownership with their current owner rather than saving or publishing inside an endpoint merely for convenience.
4. Implement one complete boundary behavior and its nearest real-host regression test, then run that focused check immediately before adjacent changes. Ensure routes/controllers are discovered, middleware order is correct, authorization actually applies, and validation actually executes. A handler or mediator test does not prove any of these HTTP properties.
5. Apply existing error-to-response conventions consistently. Keep ProblemDetails and other error responses free of stack traces, secrets, or personal payloads. Exclude server-owned/privileged fields from bindable input. Check relevant invalid-input, anonymous, forbidden, not-found, conflict, success, and Location-header cases without inventing responses the contract does not require.
6. Update version-specific OpenAPI registration/metadata, response schemas, operation identifiers, and named resource routes where affected. Resolve uncertain APIs with dotnet-library-docs using the target's package versions. Exercise the actual document endpoint when documentation generation changes; annotations or compilation alone are not proof.
7. Update existing HTTP examples or consumer docs when appropriate, using synthetic values and no credentials. Run the affected build and required impact gates; report commands/results separately from blocked checks. Do not start infrastructure, change schemas, or deploy without approval.

Return the HTTP contract change, files/registration touched, focused HTTP results, compatibility assumptions, and remaining gates. For controller-based targets, apply shared HTTP checks without replacing controllers with the Minimal API template. Do not duplicate a business slice workflow inside this skill.

## Template Routing

Paths resolve from the installed target repository root; in the toolkit checkout use corresponding `templates/` paths. Read only guides relevant to the changed boundary and preserve target conventions.

- Read `.ai-toolkit/templates/web-api/README.md` when locating HTTP host ownership and the minimum application structure for the change.
- Read `.ai-toolkit/templates/minimal-endpoint/README.md` when changing Minimal API discovery, binding, dispatch, response semantics, or named routes.
- Read `.ai-toolkit/templates/validation/README.md` when the API change affects request validation, error responses, or actual execution of input rules.
- Read `.ai-toolkit/templates/api-versioning/README.md` when changing public route versions, compatibility behavior, or OpenAPI documents and metadata.
- Read `.ai-toolkit/templates/dependency-injection/README.md` when endpoint/controller discovery, handlers, or HTTP infrastructure need registration changes.
- Read `.ai-toolkit/templates/testing/README.md` when choosing real-host HTTP checks for routing, middleware, authorization, errors, and document generation.
- Read `.ai-toolkit/templates/observability/README.md` when changing request correlation, health exposure, or HTTP logging and telemetry redaction.