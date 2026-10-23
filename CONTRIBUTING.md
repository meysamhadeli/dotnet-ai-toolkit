# Contributing

Contributions must help an AI assistant develop, test, secure, observe, or deliver a .NET application or library. Keep project types distinct from reusable concept templates; unrelated general-purpose agent collections are outside scope.

1. Read [maintainer instructions](AGENTS.md) and [authoring rules](docs/authoring.md).
2. Make a focused, original change. Do not copy prompts, scripts, source, or media from reference projects.
3. Update catalog, examples, documentation, and changelog according to the maintenance matrix.
4. Run `npm run check` with a supported Node.js version. Toolkit checks need no package installation. Website changes also require `npm --prefix website ci`, `npm run docs:build`, and `npm run docs:check`; see [website maintenance](docs/website.md).
5. Propose a pull request with behavior, evidence, and remaining verification gaps. Never include credentials or personal data.

Installer tests must operate only in temporary directories and clean up their fixtures. Existing instructions and user changes must remain intact. New host configurations or MCP integrations need clear trust/permission boundaries.

For skills distribution, edit canonical `skills/`, `templates/`, and `knowledge/` sources rather than generated archives. Run `node --test tests/package-skills.test.mjs` and `npm run skills:pack`. Packaging checks verify adapted resource paths, deterministic archives, licenses, and Vercel download/extraction limits. A real CLI compatibility check must use temporary targets and supported Node.js, disable telemetry/security-audit requests for private/local payloads, and distinguish CLI installation from live assistant discovery. See [adoption](docs/adoption.md) for Vercel versus full-installer guarantees.

Report defects with the command, expected/actual behavior, OS, Node.js version, and sanitized reproduction. Documentation improvements should distinguish recommendations from tested guarantees.

## CI and Release Notes

[CI](.github/workflows/ci.yml) runs `npm run check` on Windows and Linux with Node.js 22 and 24 for pushes and pull requests. Documentation changes are validated too. The Copilot setup workflow uses the same gate on Node.js 22. Neither workflow requires npm installation or .NET tooling.

[Documentation CI](.github/workflows/docs.yml) separately installs locked website dependencies, builds the Nextra static export, checks local routes/assets, and deploys reviewed `main` pushes to GitHub Pages. Pull requests build without deployment permissions. Configure Pages to use GitHub Actions before publishing. This is documentation hosting, not application deployment or package publication.

[Release drafting](.github/workflows/release-drafter.yml) updates an unpublished draft after successful push CI on the repository's default branch. Maintainers may also run it manually from that branch; manual dispatch does not run or replace CI. Draft generation can include newer branch changes, so it is not proof that every proposed release commit passed validation.

[PR labeling](.github/workflows/release-drafter-labeler.yml) uses `pull_request_target` for default-branch PRs, including forks. It reads trusted base-branch configuration through the action, has no checkout or shell steps, and must never execute PR code or consume untrusted build artifacts. Keep contents writes confined to the drafter job; the labeler only needs contents read and pull-request write permissions. The default `GITHUB_TOKEN` is sufficient when repository/organization policy allows those permissions; do not add a personal token as a workaround without review.

Use conventional titles such as `feat:`, `fix:`, `docs:`, `ci:`, `test:`, `deps:`, `security:`, or `chore:`. The [configuration](.github/release-drafter.yml) groups merged PRs and resolves major/minor/patch suggestions. Breaking conventional titles or `major` request a major increment; features or `minor` request minor; otherwise patch is the fallback. `skip-changelog` excludes a PR from both notes and version resolution. Labels are additive; remove obsolete labels after retitling a PR.

Before relying on automation, ensure the repository has these labels: `feature`, `bug`, `documentation`, `dependencies`, `ci`, `test`, `security`, `maintenance`, `major`, `minor`, `patch`, and `skip-changelog`. Optional aliases recognized by the configuration are `enhancement`, `fix`, `docs`, and `deps`. Use category labels for the type of change; maintainers choose version overrides deliberately. Do not include undisclosed security details in public PRs or drafts.

Before manually publishing a release:

1. Review included PRs, labels, compatibility notes, and the proposed version. Initial releases need an explicit version decision; the action does not read the toolkit's package version.
2. Synchronize `package.json`, `toolkit.json`, and `CHANGELOG.md` in a reviewed change. Drafting does not edit those files.
3. Verify required CI for the intended release commit and review the draft's target and tag against that commit.
4. Publish only with explicit maintainer authorization. There is no automatic npm/NuGet publishing, plugin distribution, application deployment, or release asset upload. Documentation has its own GitHub Pages workflow.

The local source guards and actionlint checks are not live GitHub execution results. Repository policy, available labels, bot behavior, and first-release versioning must be verified on GitHub after the workflows are adopted.