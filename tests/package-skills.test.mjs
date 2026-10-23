import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { gunzipSync } from 'node:zlib';
import { archiveFiles, buildSkillPack, renderPackResource } from '../scripts/package-skills.mjs';
import { toolkitRoot } from '../scripts/validate.mjs';

function unpack(archive) {
  const bytes = gunzipSync(archive);
  const files = new Map();
  for (let offset = 0; bytes[offset];) {
    const header = bytes.subarray(offset, offset + 512);
    const name = header.subarray(0, 100).toString().replace(/\0.*$/, '');
    const size = Number.parseInt(header.subarray(124, 136).toString(), 8);
    const checksum = Number.parseInt(header.subarray(148, 156).toString(), 8);
    const check = Buffer.from(header);
    check.fill(32, 148, 156);
    assert.equal(check.reduce((sum, byte) => sum + byte, 0), checksum, name);
    assert.equal(header[156], 48, 'Archives contain regular files only');
    files.set(name, bytes.subarray(offset + 512, offset + 512 + size).toString());
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return files;
}

test('Vercel archive is deterministic, bounded, and contains every canonical skill', async () => {
  const pack = await buildSkillPack();
  const unpacked = unpack(pack.archive);
  assert.deepEqual(unpacked, pack.files);
  assert.deepEqual(pack.archive, archiveFiles(pack.files));
  assert.ok(pack.archive.length < 10 * 1024 * 1024, 'Vercel default download limit');
  assert.ok([...pack.files.values()].reduce((total, value) => total + Buffer.byteLength(value), 0) < 25 * 1024 * 1024, 'Vercel default extraction limit');
  assert.ok(pack.files.size < 1000, 'Vercel default archive file limit');
  assert.equal(pack.skills.length, 14);
  for (const name of pack.skills) {
    const body = unpacked.get(`skills/${name}/SKILL.md`);
    assert.ok(body.includes(`name: ${name}`));
    assert.ok(body.includes("relative to this skill's installed directory"));
    assert.ok(!body.includes('.ai-toolkit/'));
    for (const [, relative] of body.matchAll(/`(references\/[^`]+\.md)`/g)) {
      assert.ok(unpacked.has(`skills/${name}/${relative}`), `${name}: ${relative}`);
    }
    assert.ok(unpacked.has(`skills/${name}/LICENSE`));
  }
  assert.ok(![...unpacked.keys()].some(file => /\/agents\/|\/host\/|\.github|\.claude/.test(file)));
});

test('skills-only resources retain bundled links and externalize unbundled guides', () => {
  const text = '[Tests](testing/README.md#checks) [Evals](../evals/README.md) `literal`\n```md\n[Evals](../evals/README.md)\n```';
  const rendered = renderPackResource(text, 'templates/README.md', new Set(['templates/testing/README.md']));
  assert.ok(rendered.includes('[Tests](testing/README.md#checks)'));
  assert.ok(rendered.includes('[Evals](https://github.com/meysamhadeli/dotnet-ai-toolkit/blob/main/evals/README.md)'));
  assert.ok(rendered.includes('```md\n[Evals](../evals/README.md)\n```'));
  assert.throws(() => archiveFiles(new Map([['../escape', 'bad']])) , /Unsafe/);
});

test('packaging never changes canonical skill paths used by the full installer', async () => {
  await buildSkillPack();
  const canonical = await readFile(path.join(toolkitRoot, 'skills/dotnet-api/SKILL.md'), 'utf8');
  assert.ok(canonical.includes('.ai-toolkit/templates/'));
  assert.ok(!canonical.includes('## Packaged Resource Paths'));
});
