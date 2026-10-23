import assert from 'node:assert/strict';
import { lstat, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { toolkitRoot } from '../scripts/validate.mjs';

test('toolkit keeps canonical capabilities separate from templates, knowledge, and host configuration', async () => {
  for (const directory of ['skills', 'agents', 'plugins', 'evals', 'mcp', 'templates', 'knowledge', 'website', '.cursor', '.codex', '.claude', '.opencode']) {
    assert.ok((await lstat(path.join(toolkitRoot, directory))).isDirectory(), directory);
  }
  assert.ok((await lstat(path.join(toolkitRoot, 'plugins/README.md'))).isFile());
  for (const directory of ['profiles', 'blueprints', 'adapters', 'integrations']) {
    await assert.rejects(lstat(path.join(toolkitRoot, directory)), { code: 'ENOENT' });
  }
  const catalog = JSON.parse(await readFile(path.join(toolkitRoot, 'toolkit.json'), 'utf8'));
  assert.equal(catalog.projectTemplate, 'templates/README.md');
  assert.ok(!Object.hasOwn(catalog, 'profile'));
  for (const asset of catalog.assets) {
    assert.ok(!/^(profiles|blueprints|adapters|integrations)\//.test(asset.path), asset.path);
  }
});

test('templates separate project types from reusable .NET concepts', async () => {
  const catalog = JSON.parse(await readFile(path.join(toolkitRoot, 'toolkit.json'), 'utf8'));
  const expected = [
    'class-library', 'modular-monolith', 'monolith', 'web-api', 'microservice',
    'vertical-slice', 'feature-slice', 'cqrs', 'validation', 'minimal-endpoint',
    'domain-model', 'persistence', 'messaging', 'read-model', 'testing',
    'dependency-injection', 'api-versioning', 'aspire', 'observability'
  ];
  for (const name of expected) {
    const location = `templates/${name}/README.md`;
    assert.ok(catalog.assets.some(asset => asset.path === location && asset.kind === 'template'), location);
    assert.ok((await lstat(path.join(toolkitRoot, location))).isFile(), location);
  }
  await assert.rejects(lstat(path.join(toolkitRoot, 'templates/booking-microservices')), { code: 'ENOENT' });
  const modular = await readFile(path.join(toolkitRoot, 'templates/modular-monolith/README.md'), 'utf8');
  const monolith = await readFile(path.join(toolkitRoot, 'templates/monolith/README.md'), 'utf8');
  const library = await readFile(path.join(toolkitRoot, 'templates/class-library/README.md'), 'utf8');
  assert.ok(modular.includes('Modules/<Module>/src/'));
  assert.ok(monolith.includes('<Application>/src/'));
  assert.ok(library.includes('src/<Library>/'));
});

test('GitHub automation separates validation, draft releases, and metadata-only labeling', async () => {
  const ci = await readFile(path.join(toolkitRoot, '.github/workflows/ci.yml'), 'utf8');
  assert.ok(ci.includes('os: [ubuntu-latest, windows-latest]'));
  assert.ok(ci.includes('node: [22, 24]'));
  assert.ok(ci.includes('npm run check'));
  assert.ok(ci.includes('cancel-in-progress: true'));
  assert.doesNotMatch(ci, /pull_request_target|contents: write/);
  const setup = await readFile(path.join(toolkitRoot, '.github/workflows/copilot-setup-steps.yml'), 'utf8');
  assert.ok(setup.includes('node-version: 22'));
  assert.ok(setup.includes('npm run check'));
  for (const workflow of [ci, setup]) {
    assert.ok(workflow.includes('timeout-minutes: 15'));
    assert.ok(workflow.includes('persist-credentials: false'));
  }
  const drafter = await readFile(path.join(toolkitRoot, '.github/workflows/release-drafter.yml'), 'utf8');
  assert.ok(drafter.includes('workflow_run:'));
  assert.ok(drafter.includes('workflows: [Validate toolkit]'));
  assert.ok(drafter.includes("github.event.workflow_run.conclusion == 'success'"));
  assert.ok(drafter.includes("github.event.workflow_run.event == 'push'"));
  assert.ok(drafter.includes('github.event.workflow_run.head_repository.full_name == github.repository'));
  assert.ok(drafter.includes('github.event.workflow_run.head_branch == github.event.repository.default_branch'));
  assert.ok(drafter.includes('publish: false'));
  const labeler = await readFile(path.join(toolkitRoot, '.github/workflows/release-drafter-labeler.yml'), 'utf8');
  assert.ok(labeler.includes('pull_request_target:'));
  assert.ok(labeler.includes('types: [opened, reopened, synchronize, edited]'));
  assert.ok(labeler.includes('release-drafter/release-drafter/autolabeler@'));
  assert.doesNotMatch(labeler, /contents: write/);
  for (const workflow of [drafter, labeler]) {
    assert.doesNotMatch(workflow, /actions\/checkout|^\s+run:|publish: true/m);
  }
  const config = await readFile(path.join(toolkitRoot, '.github/release-drafter.yml'), 'utf8');
  assert.ok(config.includes('type: version-resolver'));
  assert.ok(config.includes('type: pre-exclude'));
  assert.ok(config.includes('skip-changelog'));
});