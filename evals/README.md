# Discovery Evaluation

[Discovery fixtures](discovery.json) contain original positive examples for every workflow and negative examples outside toolkit scope.

## Automated Checks

`tests/discovery.test.mjs` checks that each expected workflow exists, has a positive example, and exposes the fixture's relevant concepts in both its description and query. Negative cases must explicitly declare no expected toolkit workflow.

These are metadata and corpus checks. They do not invoke a model, rank skills, measure false positives, or prove an assistant selects the correct workflow.

The same test file also checks each skill and role's `Template Routing` section: explicit installed template paths must be cataloged, have load conditions, and collectively cover every template asset within each group. Five-host installation tests verify native skill bodies retain those paths, role paths resolve, and all Copilot/Claude roles preserve canonical bodies, current descriptions, and read/search-only metadata. This establishes static resource coverage, not semantic routing accuracy, actual template reads, or live permission enforcement.

## Live Evaluation Procedure

1. Install the kit into a clean, disposable .NET fixture repository using the chosen host configuration.
2. Record host/client version, model, toolkit commit/version, available skills, and tool permissions.
3. Start a fresh session per case. Provide the query without naming its expected skill.
4. Record which workflow and any advisory role actually loaded, whether any inappropriate workflow loaded, which template files were actually read, and whether the assistant respected task and read-only boundaries. Compare template reads with task-specific conditions; loading every guide is not success.
5. Compare with `expectedSkill`; null means no toolkit workflow should be selected. Examine neighboring ambiguities such as testing versus verification and messaging versus projections.
6. Report pass/fail, raw evidence location, and limitations. Do not run deployment, destructive recovery, or non-test infrastructure to evaluate routing.

No live results are included in this release. Native discovery varies with host version; fixture validity is not model accuracy.