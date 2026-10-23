---
name: dotnet-security
description: "Audit .NET application security: resource authorization, JWT/OIDC, input trust, personal data, secrets, dependency exposure, and gateway-to-service boundaries. Use for focused security analysis, not routine style review."
---

# Audit a Trust Boundary

Read-only by default. Never probe deployed systems without authorization.

1. Start from one endpoint, consumer, or identity flow. Identify caller, trusted claims, resource owner, and sensitive fields.
2. Verify authentication and authorization independently. Gateway protection does not replace service-side resource checks.
3. Trace issuer/audience/signature validation, scopes/policies, object-level access, mass assignment, query bounds, and parameterized persistence.
4. Check token/password handling, configuration secret sources, logs/traces, error responses, and events for personal-data exposure.
5. Inspect relevant dependencies and actual versions for known advisories using approved tools. Report advisory evidence, not guessed vulnerability labels.
6. Suggest a focused negative test proving denied access or rejected input. Run checks only when tools and authorization permit.

Return severity-ranked evidence with exploit preconditions, impact, minimal fix, and verification gaps. Do not include real credentials or reproduce sensitive payloads.

## Template Routing

- Read `.ai-toolkit/templates/minimal-endpoint/README.md` when reviewing endpoint authorization, resource access, or unsafe HTTP responses.
- Read `.ai-toolkit/templates/validation/README.md` when reviewing input trust boundaries, overposting, or whether validation actually executes.
- Read `.ai-toolkit/templates/observability/README.md` when reviewing sensitive logging, trace attributes, telemetry exposure, or health endpoint disclosure.