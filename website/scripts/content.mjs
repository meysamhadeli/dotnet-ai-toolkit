import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { repository } from '../site.config.mjs';
import { mapMarkdownProse } from '../../scripts/markdown.mjs';

export const root = fileURLToPath(new URL('../../', import.meta.url));
export const websiteRoot = path.join(root, 'website');

export function routeFor(source) {
  if (source === 'README.md') return '/';
  if (source === 'templates/README.md') return '/templates/';
  if (source === 'mcp/README.md') return '/integrations/mcp/';
  if (source === 'plugins/README.md') return '/integrations/plugins/';
  if (source === 'evals/README.md') return '/guides/evaluation/';
  if (source === 'CONTRIBUTING.md') return '/guides/contributing/';
  if (source === 'CHANGELOG.md') return '/guides/changelog/';
  if (/^skills\/[^/]+\/SKILL\.md$/.test(source)) return `/workflows/${source.split('/')[1]}/`;
  if (/^agents\/[^/]+\.md$/.test(source)) return `/roles/${path.posix.basename(source, '.md')}/`;
  if (/^templates\/[^/]+\/README\.md$/.test(source)) return `/templates/${source.split('/')[1]}/`;
  if (/^(knowledge|docs)\/[^/]+\.md$/.test(source)) {
    return `/${source.startsWith('docs/') ? 'guides' : 'knowledge'}/${path.posix.basename(source, '.md')}/`;
  }
  return null;
}

export function sourceEntries(catalog) {
  const sources = new Set(catalog.assets
    .filter(asset => ['skill', 'agent', 'template', 'knowledge', 'guide'].includes(asset.kind) && asset.path.endsWith('.md'))
    .map(asset => asset.path));
  for (const source of ['docs/authoring.md', 'docs/readiness.md', 'docs/website.md', 'CONTRIBUTING.md', 'CHANGELOG.md', 'mcp/README.md', 'plugins/README.md', 'evals/README.md']) {
    sources.add(source);
  }
  return [...sources].map(source => {
    const route = routeFor(source);
    if (!route) throw new Error(`No documentation route for ${source}`);
    return { source, route };
  });
}

export function rewriteLink(target, source, routes) {
  if (!target || target.startsWith('#') || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) return target;
  const match = target.match(/^([^#?]*)([?#].*)?$/);
  const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(source), decodeURIComponent(match[1])));
  if (resolved === '..' || resolved.startsWith('../')) throw new Error(`Link escapes repository in ${source}: ${target}`);
  const suffix = match[2] ?? '';
  const route = routes.get(resolved);
  return route ? `${route}${suffix}` : `${repository}/blob/main/${resolved}${suffix}`;
}

export function toMdx(markdown, source, routes) {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
  return mapMarkdownProse(body, part => part
        .replace(/\[([^\]]*)\]\(([^)\s]+)\)/g, (_, label, target) => `[${label}](${rewriteLink(target, source, routes)})`)
        .replace(/</g, '&lt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;'));
}

export function titleOf(markdown, fallback) {
  return markdown.match(/^# (.+)$/m)?.[1] ?? fallback;
}

async function pageFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(entry => {
    const location = path.join(directory, entry.name);
    return entry.isDirectory() ? pageFiles(location) : [location];
  }));
  return files.flat().filter(file => file.endsWith('.mdx'));
}

export async function generateContent() {
  const catalog = JSON.parse(await readFile(path.join(root, 'toolkit.json'), 'utf8'));
  const entries = sourceEntries(catalog);
  const routes = new Map([['README.md', '/'], ...entries.map(entry => [entry.source, entry.route])]);
  const output = path.join(websiteRoot, 'content');
  await rm(output, { recursive: true, force: true });
  await mkdir(output, { recursive: true });

  const sections = {
    workflows: { title: 'Workflows', intro: 'Choose one workflow for the task. Each page is generated from its canonical skill, including prerequisites, procedure, template routing, and verification boundaries.' },
    roles: { title: 'Advisory roles', intro: 'Four specialists provide evidence and proposed checks. They do not edit or execute commands. Copilot and Claude receive read/search-only native agents; other hosts receive advisory documents.' },
    templates: { title: 'Templates', intro: '' },
    knowledge: { title: 'Shared knowledge', intro: 'Common reasoning for ownership, architecture, and verification. Follow the target repository rather than imposing a universal layout.' },
    guides: { title: 'Guides', intro: 'Practical installation, first-task, troubleshooting, authoring, and maintenance guidance.' },
    integrations: { title: 'Integrations', intro: 'Optional documentation lookup and repository-only packaging guidance. No MCP server, hook, or plugin is activated by installing the toolkit.' }
  };
  const navigation = Object.fromEntries(Object.keys(sections).map(section => [section, {}]));
  const exported = [];

  async function writePage(route, content) {
    const relative = route === '/' ? 'index.mdx' :
      Object.hasOwn(sections, route.slice(1, -1)) ? `${route.slice(1)}index.mdx` : `${route.slice(1, -1)}.mdx`;
    const destination = path.join(output, relative);
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, content);
    exported.push(route);
  }

  for (const { source, route } of entries) {
    const text = await readFile(path.join(root, source), 'utf8');
    const title = titleOf(text, path.posix.basename(source, '.md'));
    const section = route.split('/')[1];
    if (route !== '/templates/') navigation[section][route.split('/')[2]] = title;
    await writePage(route, `${toMdx(text, source, routes)}\n\n---\n\n[View canonical source on GitHub](${repository}/blob/main/${source})\n`);
  }

  for (const file of await pageFiles(path.join(websiteRoot, 'authored'))) {
    const relative = path.relative(path.join(websiteRoot, 'authored'), file).split(path.sep).join('/');
    const route = relative === 'index.mdx' ? '/' : `/${relative.slice(0, -4)}/`;
    if (exported.includes(route)) throw new Error(`Duplicate documentation route: ${route}`);
    const content = await readFile(file, 'utf8');
    if (route.split('/').length > 3) navigation[route.split('/')[1]][route.split('/')[2]] = titleOf(content, relative);
    await writePage(route, content);
  }

  for (const [section, { title, intro }] of Object.entries(sections)) {
    if (section !== 'templates') {
      const links = Object.entries(navigation[section]).map(([slug, label]) => `- [${label}](/${section}/${slug}/)`).join('\n');
      await writePage(`/${section}/`, `# ${title}\n\n${intro}\n\n${links}\n`);
    }
    await mkdir(path.join(output, section), { recursive: true });
    await writeFile(path.join(output, section, '_meta.js'), `export default ${JSON.stringify({ index: 'Overview', ...navigation[section] }, null, 2)};\n`);
  }
  const meta = {
    index: {
      title: 'Overview',
      theme: { layout: 'full', sidebar: false, toc: false, pagination: false, breadcrumb: false }
    },
    'getting-started': 'Get started',
    ...Object.fromEntries(Object.entries(sections).map(([key, section]) => [key, section.title]))
  };
  await writeFile(path.join(output, '_meta.js'), `export default ${JSON.stringify(meta, null, 2)};\n`);
  await writeFile(path.join(websiteRoot, 'routes.json'), JSON.stringify(exported.sort(), null, 2));
  console.log(`Generated ${exported.length} documentation pages from canonical sources and website guides.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  await generateContent();
}
