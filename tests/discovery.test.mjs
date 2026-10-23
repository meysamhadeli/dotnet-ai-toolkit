import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { toolkitRoot } from '../scripts/validate.mjs';

test('discovery corpus covers every .NET skill and exposes relevant description concepts', async () => {
  const manifest = JSON.parse(await readFile(path.join(toolkitRoot, 'toolkit.json'), 'utf8'));
  const corpus = JSON.parse(await readFile(path.join(toolkitRoot, 'evals/discovery.json'), 'utf8'));
  const skills = new Map();
  for (const asset of manifest.assets.filter(asset => asset.kind === 'skill')) {
    const text = await readFile(path.join(toolkitRoot, asset.path), 'utf8');
    const name = path.basename(path.dirname(asset.path));
    skills.set(name, text.match(/^description: (.+)$/m)[1].toLowerCase());
  }
  const covered = new Set();
  const identifiers = new Set();
  let negativeCount = 0;
  assert.equal(corpus.schemaVersion, 1);
  for (const item of corpus.cases) {
    assert.ok(item.id && item.query);
    assert.ok(!identifiers.has(item.id), `Duplicate case: ${item.id}`);
    identifiers.add(item.id);
    if (item.expectedSkill === null) {
      assert.equal(item.outsideScope, true);
      negativeCount++;
      continue;
    }
    assert.ok(skills.has(item.expectedSkill), `Unknown skill: ${item.expectedSkill}`);
    assert.ok(item.expectedSkill.startsWith('dotnet-'));
    assert.ok(item.descriptionTerms.length >= 2);
    for (const term of item.descriptionTerms) {
      assert.ok(skills.get(item.expectedSkill).includes(term.toLowerCase()), `${item.id}: description missing ${term}`);
      assert.ok(item.query.toLowerCase().includes(term.toLowerCase()), `${item.id}: query missing ${term}`);
    }
    covered.add(item.expectedSkill);
  }
  assert.deepEqual([...covered].sort(), [...skills.keys()].sort());
  assert.ok(negativeCount >= 3);
});

for (const kind of ['skill', 'agent']) {
  test(`${kind}s explicitly route every cataloged template with a load condition`, async () => {
    const manifest = JSON.parse(await readFile(path.join(toolkitRoot, 'toolkit.json'), 'utf8'));
    const templates = new Set(manifest.assets.filter(asset => asset.kind === 'template').map(asset => asset.path));
    const covered = new Set();
    for (const asset of manifest.assets.filter(asset => asset.kind === kind)) {
      const text = await readFile(path.join(toolkitRoot, asset.path), 'utf8');
      const routing = text.split(/^## Template Routing\r?$/m)[1];
      assert.ok(routing, `${asset.path}: missing template routing section`);
      const routes = [...routing.split(/^## /m)[0].matchAll(/^- Read `\.ai-toolkit\/(templates\/[^`]+)` when (.+)\.$/gm)];
      assert.ok(routes.length, `${asset.path}: missing conditional template reads`);
      for (const [, template, condition] of routes) {
        assert.ok(templates.has(template), `${asset.path}: unknown template ${template}`);
        assert.ok(condition.trim().length >= 20, `${asset.path}: explain when to read ${template}`);
        covered.add(template);
      }
    }
    assert.deepEqual([...covered].sort(), [...templates].sort(), `Every template needs an explicit ${kind} route`);
  });
}