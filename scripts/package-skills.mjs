import { lstat, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { gzipSync } from 'node:zlib';
import { mapMarkdownProse } from './markdown.mjs';
import { safeRelative, toolkitRoot } from './validate.mjs';

const repository = 'https://github.com/meysamhadeli/dotnet-ai-toolkit';

export function archiveFiles(files) {
  const blocks = [];
  for (const [name, value] of [...files].sort(([left], [right]) => left.localeCompare(right, 'en'))) {
    if (!safeRelative(name) || Buffer.byteLength(name) > 99) throw new Error(`Unsafe or excessive archive path: ${name}`);
    const content = Buffer.from(value);
    const header = Buffer.alloc(512);
    const field = (text, offset, length) => header.write(text, offset, length, 'ascii');
    const octal = (value, length) => `${value.toString(8).padStart(length - 1, '0')}\0`;
    field(name, 0, 100);
    field(octal(0o644, 8), 100, 8);
    field(octal(0, 8), 108, 8);
    field(octal(0, 8), 116, 8);
    field(octal(content.length, 12), 124, 12);
    field(octal(0, 12), 136, 12);
    field('        ', 148, 8);
    field('0', 156, 1);
    field('ustar\0', 257, 6);
    field('00', 263, 2);
    const checksum = header.reduce((total, byte) => total + byte, 0);
    field(`${checksum.toString(8).padStart(6, '0')}\0 `, 148, 8);
    blocks.push(header, content, Buffer.alloc((512 - content.length % 512) % 512));
  }
  blocks.push(Buffer.alloc(1024));
  return gzipSync(Buffer.concat(blocks), { level: 9 });
}

export function renderPackResource(text, source, bundled) {
  return mapMarkdownProse(text, part => part.replace(/\[([^\]]*)\]\(([^)\s]+)\)/g, (_, label, target) => {
    if (target.startsWith('#') || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(target)) return `[${label}](${target})`;
    const [, file, suffix = ''] = target.match(/^([^#?]*)([?#].*)?$/);
    const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(source), decodeURIComponent(file)));
    if (!safeRelative(resolved)) throw new Error(`Unsafe source link in ${source}: ${target}`);
    return `[${label}](${bundled.has(resolved) ? target : `${repository}/blob/main/${resolved}${suffix}`})`;
  }));
}

export function renderPackSkill(text) {
  const header = text.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n/);
  if (!header) throw new Error('Packaged skill is missing YAML frontmatter.');
  return `${header[0]}
## Packaged Resource Paths

This is the skills-only distribution. Resolve all \`references/\` paths below relative to this skill's installed directory, not the application repository root. Shared project templates and knowledge are bundled alongside this file. Read only task-relevant guides. This package does not install host instructions, register specialist roles, activate MCP, or authorize infrastructure changes.

${text.slice(header[0].length).replaceAll('.ai-toolkit/', 'references/')}`;
}

export async function buildSkillPack(source = toolkitRoot) {
  const catalog = JSON.parse(await readFile(path.join(source, 'toolkit.json'), 'utf8'));
  const shared = catalog.assets.filter(asset => ['template', 'knowledge'].includes(asset.kind));
  const skills = catalog.assets.filter(asset => asset.kind === 'skill');
  const bundled = new Set(shared.map(asset => asset.path));
  async function readSource(relative) {
    if (!safeRelative(relative)) throw new Error(`Unsafe package source: ${relative}`);
    let location = source;
    for (const part of relative.split('/')) {
      location = path.join(location, part);
      if ((await lstat(location)).isSymbolicLink()) throw new Error(`Refusing symlinked package source: ${relative}`);
    }
    return readFile(location, 'utf8');
  }
  const resources = await Promise.all(shared.map(async asset => [
    asset.path, renderPackResource(await readSource(asset.path), asset.path, bundled)
  ]));
  const license = await readSource('LICENSE');
  const files = new Map();
  for (const skill of skills) {
    const name = skill.path.split('/')[1];
    const directory = `skills/${name}`;
    files.set(`${directory}/SKILL.md`, renderPackSkill(await readSource(skill.path)));
    files.set(`${directory}/LICENSE`, license);
    for (const [relative, text] of resources) files.set(`${directory}/references/${relative}`, text);
  }
  return { archive: archiveFiles(files), files, skills: skills.map(skill => skill.path.split('/')[1]) };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const { archive, files, skills } = await buildSkillPack();
  const destination = path.join(toolkitRoot, 'website', 'public', 'skills.tar.gz');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, archive);
  console.log(`Packaged ${skills.length} self-contained skills (${files.size} files, ${archive.length} bytes): website/public/skills.tar.gz`);
}
