import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { basePath } from '../site.config.mjs';
import { sourceEntries, root, websiteRoot } from './content.mjs';

const out = path.join(websiteRoot, 'out');
const routes = JSON.parse(await readFile(path.join(websiteRoot, 'routes.json'), 'utf8'));
const catalog = JSON.parse(await readFile(path.join(root, 'toolkit.json'), 'utf8'));
for (const entry of sourceEntries(catalog)) assert.ok(routes.includes(entry.route), `Missing canonical page: ${entry.source}`);
for (const route of ['/', '/getting-started/', '/guides/first-workflow/', '/guides/troubleshooting/']) {
  assert.ok(routes.includes(route), `Missing onboarding page: ${route}`);
}

const origin = 'https://docs.example';
const checked = new Set();
for (const route of routes) {
  const html = await readFile(path.join(out, route.slice(1), 'index.html'), 'utf8');
  assert.ok(html.includes('dotnet-ai-toolkit'), `Missing site identity: ${route}`);
  for (const [, attribute, value] of html.matchAll(/(?:^|\s)(href|src)="([^"]+)"/g)) {
    const url = new URL(value.replaceAll('&amp;', '&'), `${origin}${basePath}${route}`);
    if (url.origin !== origin || value.startsWith('#')) continue;
    assert.ok(!basePath || url.pathname.startsWith(`${basePath}/`), `Unprefixed ${attribute} in ${route}: ${value}`);
    const relative = decodeURIComponent(url.pathname.slice(basePath.length)).replace(/^\/+/, '');
    if (checked.has(relative)) continue;
    checked.add(relative);
    const file = path.join(out, relative || 'index.html');
    const info = await stat(file).catch(error => {
      throw new Error(`Broken ${attribute} in ${route}: ${value}`, { cause: error });
    });
    if (info.isDirectory()) await stat(path.join(file, 'index.html'));
  }
}
await stat(path.join(out, '_pagefind', 'pagefind.js'));
await stat(path.join(out, '404.html'));
const archive = await readFile(path.join(out, 'skills.tar.gz'));
const sourceArchive = await readFile(path.join(websiteRoot, 'public', 'skills.tar.gz'));
assert.deepEqual(archive, sourceArchive, 'Exported Vercel archive must match generated source');
assert.ok(gunzipSync(archive).length > 1024, 'Vercel download must contain a valid gzip payload');
console.log(`Verified ${routes.length} exported routes, ${checked.size} local links/assets, Vercel archive, Pagefind, and 404 output under ${basePath || '/'}.`);
