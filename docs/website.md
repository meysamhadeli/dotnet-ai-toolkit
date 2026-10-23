# Documentation Website

The public documentation uses Nextra's documentation theme and Next.js static export. It is a separate npm package in [website/](../website/); the toolkit installer and root checks remain dependency-free.

## Local Development

Requires Node.js 22 or later. From the repository root:

```bash
npm --prefix website ci
npm run docs:dev
```

Open `http://localhost:3000/dotnet-ai-toolkit/`. Search requires a production build because Pagefind indexes exported HTML.

```bash
npm run check
npm run docs:build
npm run docs:check
```

The build generates the content directory and self-contained Vercel skills archive from canonical sources, exports static HTML, and creates a Pagefind search index. The export check verifies route coverage, internal links, assets, the skills download, and the search bundle. Generated content and build output are ignored by Git.

Nextra and its docs theme are pinned together at 4.6.0. The 4.6.1 pair failed local prerendering with a required `children` schema error in the theme layout; do not upgrade either package independently or bypass schema validation. Next.js uses the maintained 15.5 line: the tested 16.4.3 export requested missing catch-all RSC prefetch files in the browser. Validate future upgrades with the complete static build, export checks, and browser navigation/search checks.

## Content Ownership

Edit workflows in `skills/`, roles in `agents/`, templates in `templates/`, and shared guidance in `knowledge/`. The website generator reads the explicit toolkit catalog and selected repository guides. It removes skill frontmatter, rewrites source links to documentation routes, and links non-page resources back to GitHub. Never maintain copied workflow bodies in the website.

Website-only onboarding, navigation, and presentation live in `website/authored/` and `website/app/`. New cataloged Markdown skills, roles, knowledge, templates, and guides appear on the next build. Update navigation tests when intentionally changing sections. The website and its dependencies are not installed into consumer repositories.

`npm run skills:pack` generates only `website/public/skills.tar.gz`, without website dependencies. Every skill contains its canonical workflow with adapted resource paths, all shared templates/knowledge, and the MIT license. No roles or host configuration are included. The packager uses standard Node.js APIs and emits deterministic regular-file-only tar/gzip output; tests enforce Vercel's default size/file limits. The documentation build places this download at `/dotnet-ai-toolkit/skills.tar.gz`.

## GitHub Pages

The expected project URL is `https://meysamhadeli.github.io/dotnet-ai-toolkit/`.

1. Commit and push the reviewed toolkit and website sources to `main`. Do not publish unrelated or sensitive working-tree files.
2. In repository **Settings > Pages > Build and deployment**, select **GitHub Actions**. Repository policy must allow Pages deployment and Actions.
3. Run the **Deploy documentation** workflow on `main`, or push a change covered by its path filters.
4. Review the build and deployment jobs. Open the deployment URL and verify navigation, search, theme switching, and a nested page reload.

The workflow runs root checks, installs only the website's locked dependencies, builds and checks the export, then uploads the static artifact. Only the deployment job has `pages: write` and `id-token: write`; build jobs have read-only repository access. Pull requests build and check but cannot deploy. No personal token or credentials belong in source.

The workflow publishes documentation only, not npm/NuGet packages or application infrastructure. It does not configure repository Pages settings. Local builds are not evidence of successful live deployment.

## Paths and Hosting

The default base path is `/dotnet-ai-toolkit`; static pages use trailing slashes so nested reloads work on GitHub Pages. `NEXT_PUBLIC_BASE_PATH` may be set at build time for another host (an empty value serves at the domain root). Use an empty value for a custom domain that serves the site at `/`, and configure DNS and Pages separately. Rebuild after changing the base path; do not edit exported HTML.

Do not use `next start` for the static export. Serve `website/out/` under the configured base path using a static server, or use the deployed Pages site.
