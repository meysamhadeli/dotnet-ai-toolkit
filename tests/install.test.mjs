import assert from 'node:assert/strict';
import { lstat, mkdir, mkdtemp, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { hosts, install, parseArguments } from '../scripts/install.mjs';

async function fixture(run) {
  const root = await mkdtemp(path.join(os.tmpdir(), 'dotnet-toolkit-'));
  try {
    await run(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

for (const assistant of Object.keys(hosts)) {
  test(`${assistant}: dry-run, install, and repeat install`, async () => fixture(async target => {
    const plan = await install({ target, assistant, dryRun: true });
    assert.ok(plan.length > 30);
    assert.deepEqual(await readdir(target), []);
    await install({ target, assistant });
    const entry = await readFile(path.join(target, hosts[assistant].entry), 'utf8');
    assert.ok(entry.includes('.ai-toolkit/templates/README.md'));
    assert.ok(entry.includes('.ai-toolkit/knowledge/architecture.md'));
    const catalog = JSON.parse(await readFile(path.join(target, '.ai-toolkit/toolkit.json'), 'utf8'));
    for (const asset of catalog.assets.filter(asset => asset.kind === 'template')) {
      assert.ok((await lstat(path.join(target, '.ai-toolkit', asset.path))).isFile());
    }
    await assert.rejects(lstat(path.join(target, '.ai-toolkit/templates/booking-microservices')), { code: 'ENOENT' });
    await assert.rejects(lstat(path.join(target, hosts[assistant].skills, 'dotnet-add-slice')), { code: 'ENOENT' });
    await assert.rejects(lstat(path.join(target, '.ai-toolkit/skills/dotnet-add-slice')), { code: 'ENOENT' });
    assert.ok((await lstat(path.join(target, hosts[assistant].source))).isFile());
    for (const asset of catalog.assets.filter(asset => asset.kind === 'skill')) {
      const nativePath = path.join(target, hosts[assistant].skills, asset.path.slice('skills/'.length));
      const native = await readFile(nativePath, 'utf8');
      assert.equal(native, await readFile(path.join(target, '.ai-toolkit', asset.path), 'utf8'));
      assert.ok(native.includes('## Template Routing'));
      for (const [, template] of native.matchAll(/`(\.ai-toolkit\/templates\/[^`]+)`/g)) {
        assert.ok((await lstat(path.join(target, template))).isFile(), `${assistant}: missing ${template}`);
      }
    }
    for (const asset of catalog.assets.filter(asset => asset.kind === 'agent')) {
      const canonical = await readFile(path.join(target, '.ai-toolkit', asset.path), 'utf8');
      assert.ok(canonical.includes('## Template Routing'));
      assert.ok(canonical.includes('## Handoff'));
      for (const [, template] of canonical.matchAll(/`(\.ai-toolkit\/templates\/[^`]+)`/g)) {
        assert.ok((await lstat(path.join(target, template))).isFile(), `${assistant}: missing ${template}`);
      }
      if (hosts[assistant].agents) {
        const name = path.posix.basename(asset.path, '.md');
        const agent = await readFile(path.join(target, hosts[assistant].agents, `${name}${hosts[assistant].agentExtension}`), 'utf8');
        assert.equal(agent.match(/^name: (.+)$/m)[1], name);
        assert.equal(JSON.parse(agent.match(/^description: (.+)$/m)[1]), asset.description);
        assert.equal(agent.match(/^tools: (.+)$/m)[1], assistant === 'copilot' ? '[read, search]' : '[Read, Grep, Glob]');
        assert.ok(agent.endsWith(`\n\n${canonical}`));
      }
    }
    assert.ok((await install({ target, assistant })).every(item => item.action === 'unchanged'));
    await assert.rejects(lstat(path.join(target, '.mcp.json')), { code: 'ENOENT' });
    await assert.rejects(lstat(path.join(target, '.ai-toolkit/plugins')), { code: 'ENOENT' });
    await assert.rejects(lstat(path.join(target, 'plugins')), { code: 'ENOENT' });
    for (const removed of ['profiles', 'blueprints', 'adapters', 'integrations']) {
      await assert.rejects(lstat(path.join(target, '.ai-toolkit', removed)), { code: 'ENOENT' });
    }
    if (assistant === 'claude') {
      assert.ok((await lstat(path.join(target, '.claude/rules/dotnet.md'))).isFile());
    } else {
      await assert.rejects(lstat(path.join(target, '.claude/rules/dotnet.md')), { code: 'ENOENT' });
    }
  }));
}

test('conflict is detected before any file is written', async () => fixture(async target => {
  await mkdir(path.join(target, '.github'));
  const entry = path.join(target, '.github/copilot-instructions.md');
  await writeFile(entry, 'User instructions must survive.');
  await assert.rejects(install({ target, assistant: 'copilot' }), /Conflict/);
  assert.equal(await readFile(entry, 'utf8'), 'User instructions must survive.');
  assert.deepEqual(await readdir(target), ['.github']);
}));

test('modified installed skills are never overwritten', async () => fixture(async target => {
  await install({ target, assistant: 'codex' });
  const skill = path.join(target, '.agents/skills/dotnet-add-feature-slice/SKILL.md');
  await writeFile(skill, 'Local changes');
  await assert.rejects(install({ target, assistant: 'codex' }), /Conflict/);
  assert.equal(await readFile(skill, 'utf8'), 'Local changes');
}));

test('multiple hosts share the canonical bundle', async () => fixture(async target => {
  await install({ target, assistant: 'copilot' });
  await install({ target, assistant: 'claude' });
  assert.deepEqual((await readdir(path.join(target, '.ai-toolkit/receipts'))).sort(), ['claude.json', 'copilot.json']);
}));

test('directory links cannot redirect writes outside target', async () => fixture(async root => {
  const target = path.join(root, 'target');
  const outside = path.join(root, 'outside');
  await mkdir(target);
  await mkdir(outside);
  await symlink(outside, path.join(target, '.ai-toolkit'), process.platform === 'win32' ? 'junction' : 'dir');
  await assert.rejects(install({ target, assistant: 'copilot' }), /symlink/);
  assert.deepEqual(await readdir(outside), []);
}));

test('file/directory collisions block installation', async () => fixture(async target => {
  await writeFile(path.join(target, '.github'), 'not a directory');
  await assert.rejects(install({ target, assistant: 'copilot' }), /not a directory/);
  assert.deepEqual(await readdir(target), ['.github']);
}));

test('strict CLI rejects invalid arguments', () => {
  assert.deepEqual(parseArguments(['--target', 'path with spaces', '--assistant', 'codex', '--dry-run']), {
    target: 'path with spaces', assistant: 'codex', dryRun: true
  });
  for (const args of [['--force'], ['--target'], ['--assistant', '--dry-run'], ['--target', 'a', '--target', 'b']]) {
    assert.throws(() => parseArguments(args));
  }
});