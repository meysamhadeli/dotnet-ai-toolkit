import assert from 'node:assert/strict';
import { mkdir, mkdtemp, writeFile, rm, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { safeRelative, validate } from '../scripts/validate.mjs';

test('asset paths cannot escape toolkit root', () => {
  for (const value of ['../escape', '/absolute', 'C:/absolute', 'a/../b', 'a\\b', '', './a', 'file:stream', 'CON.md', 'file.', 'name ', 'bad\0name']) {
    assert.equal(safeRelative(value), false, value);
  }
  assert.equal(safeRelative('skills/add-slice/SKILL.md'), true);
});

test('validator rejects absent assets, version drift, and broken local links', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'toolkit-validate-'));
  try {
    await writeFile(path.join(root, 'package.json'), JSON.stringify({ version: '0.1.0' }));
    await writeFile(path.join(root, 'toolkit.json'), JSON.stringify({
      schemaVersion: 1, version: '0.2.0', assets: [{ path: 'missing.md' }]
    }));
    await writeFile(path.join(root, 'README.md'), '[Missing](absent.md)');
    const errors = await validate(root);
    assert.ok(errors.length >= 3);
    assert.ok(errors.some(error => error.includes('versions differ')));
    assert.ok(errors.some(error => error.includes('Missing asset')));
    assert.ok(errors.some(error => error.includes('Broken link')));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('validator rejects uncataloged resources, malformed JSON, and invalid skill metadata', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'toolkit-invalid-'));
  try {
    await writeFile(path.join(root, 'package.json'), JSON.stringify({ name: 'fixture', version: '0.1.0' }));
    await writeFile(path.join(root, 'toolkit.json'), JSON.stringify({
      name: 'fixture', schemaVersion: 1, version: '0.1.0', assets: [{ path: 'example.md', kind: 'guide' }]
    }));
    await writeFile(path.join(root, 'example.md'), '# Fixture');
    await mkdir(path.join(root, 'skills', 'dotnet-example'), { recursive: true });
    await writeFile(path.join(root, 'skills', 'dotnet-example', 'SKILL.md'), '---\nname: wrong\n---\n');
    await writeFile(path.join(root, 'invalid.json'), '{');
    const errors = await validate(root);
    for (const fragment of ['Uncataloged distributable asset', 'Invalid JSON', 'Invalid skill name', 'Missing or excessive skill description', 'Invalid asset kind/path']) {
      assert.ok(errors.some(error => error.includes(fragment)), fragment);
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('validator refuses symlinked source directories', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'toolkit-source-link-'));
  try {
    const source = path.join(root, 'source');
    const outside = path.join(root, 'outside');
    await mkdir(source);
    await mkdir(outside);
    await writeFile(path.join(outside, 'example.md'), '# External');
    await writeFile(path.join(source, 'package.json'), JSON.stringify({ version: '0.1.0' }));
    await writeFile(path.join(source, 'toolkit.json'), JSON.stringify({
      schemaVersion: 1, version: '0.1.0', assets: [{ path: 'knowledge/example.md', kind: 'knowledge' }]
    }));
    await symlink(outside, path.join(source, 'knowledge'), process.platform === 'win32' ? 'junction' : 'dir');
    const errors = await validate(source);
    assert.ok(errors.some(error => error.includes('Symlink asset')));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('validator ignores generated website builds but still validates authored files', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'toolkit-website-build-'));
  try {
    await writeFile(path.join(root, 'package.json'), JSON.stringify({ version: '0.1.0' }));
    await writeFile(path.join(root, 'toolkit.json'), JSON.stringify({
      schemaVersion: 1, version: '0.1.0', assets: [{ path: 'docs/example.md', kind: 'guide' }]
    }));
    await mkdir(path.join(root, 'docs'));
    await writeFile(path.join(root, 'docs', 'example.md'), '# Example');
    for (const directory of ['.next', 'out', 'node_modules']) {
      await mkdir(path.join(root, 'website', directory), { recursive: true });
      await writeFile(path.join(root, 'website', directory, 'generated.json'), '{');
    }
    await writeFile(path.join(root, 'website', 'authored.json'), '{');
    const errors = await validate(root);
    assert.ok(errors.some(error => error.includes('authored.json')));
    assert.ok(!errors.some(error => error.includes('generated.json')));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});