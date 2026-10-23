import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { routeFor, sourceEntries, toMdx, rewriteLink, root } from '../website/scripts/content.mjs';

test('website routes every canonical capability without installing the website', async () => {
  const catalog = JSON.parse(await readFile(path.join(root, 'toolkit.json'), 'utf8'));
  const entries = sourceEntries(catalog);
  assert.equal(new Set(entries.map(entry => entry.route)).size, entries.length);
  for (const kind of ['skill', 'agent', 'template', 'knowledge', 'guide']) {
    for (const asset of catalog.assets.filter(asset => asset.kind === kind && asset.path.endsWith('.md'))) {
      assert.ok(entries.some(entry => entry.source === asset.path), asset.path);
    }
  }
  assert.ok(!catalog.assets.some(asset => asset.path.startsWith('website/')));
  assert.equal(routeFor('templates/README.md'), '/templates/');
  assert.equal(routeFor('skills/dotnet-api/SKILL.md'), '/workflows/dotnet-api/');
  assert.equal(routeFor('agents/dotnet-service-designer.md'), '/roles/dotnet-service-designer/');
});

test('website converts canonical Markdown safely without changing fenced examples', () => {
  const routes = new Map([['templates/testing/README.md', '/templates/testing/']]);
  const text = '---\nname: fixture\n---\n# Example\n\n[Tests](../templates/testing/README.md#checks)\nType<T> {value} and `Type<T>`.\n\n```cs\nvar x = new { Value = "<T>" };\n```\n';
  const result = toMdx(text, 'docs/example.md', routes);
  assert.ok(!result.includes('name: fixture'));
  assert.ok(result.includes('[Tests](/templates/testing/#checks)'));
  assert.ok(result.includes('Type&lt;T> &#123;value&#125; and `Type<T>`.'));
  assert.ok(result.includes('```cs\nvar x = new { Value = "<T>" };\n```'));
  assert.equal(rewriteLink('https://example.com', 'docs/example.md', routes), 'https://example.com');
  assert.equal(rewriteLink('#checks', 'docs/example.md', routes), '#checks');
  assert.ok(rewriteLink('../toolkit.json', 'docs/example.md', routes).endsWith('/blob/main/toolkit.json'));
  assert.throws(() => rewriteLink('../../outside.md', 'docs/example.md', routes), /escapes repository/);
});

test('Pages builds untrusted PRs without deployment permissions and deploys only main', async () => {
  const workflow = await readFile(path.join(root, '.github/workflows/docs.yml'), 'utf8');
  const [build, deploy] = workflow.split('\n  deploy:');
  assert.ok(build.includes('pull_request:'));
  assert.ok(build.includes('npm run check'));
  assert.ok(build.includes('npm --prefix website ci'));
  assert.ok(build.includes('npm run docs:build'));
  assert.ok(build.includes('npm run docs:check'));
  assert.ok(build.includes('persist-credentials: false'));
  assert.doesNotMatch(build, /pull_request_target|pages: write|id-token: write/);
  assert.ok(deploy.includes("github.event_name != 'pull_request'"));
  assert.ok(deploy.includes("github.ref == 'refs/heads/main'"));
  assert.ok(deploy.includes('needs: build'));
  assert.ok(deploy.includes('pages: write'));
  assert.ok(deploy.includes('id-token: write'));
  assert.ok(deploy.includes('github-pages'));
  assert.doesNotMatch(deploy, /actions\/checkout|^\s+run:/m);
});
