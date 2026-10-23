import { lstat, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const toolkitRoot = fileURLToPath(new URL('../', import.meta.url));

export async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.filter(entry => !['.git', 'node_modules', '.next', 'out'].includes(entry.name)).map(async entry => {
    const location = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(location) : [location];
  }));
  return files.flat();
}

export function safeRelative(value) {
  return typeof value === 'string' && value.length > 0 && !value.includes('\\') &&
    !path.posix.isAbsolute(value) && !/^[A-Za-z]:/.test(value) &&
    !/[<>:"|?*\u0000-\u001f]/.test(value) &&
    value.split('/').every(part => part !== '..' && part !== '.' && part !== '' &&
      !/[. ]$/.test(part) && !/^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(part));
}

export async function validate(root = toolkitRoot) {
  const errors = [];
  const manifest = JSON.parse(await readFile(path.join(root, 'toolkit.json'), 'utf8'));
  const packageInfo = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
  if (manifest.schemaVersion !== 1) errors.push('Unsupported manifest schema.');
  if (manifest.version !== packageInfo.version) errors.push('Package and catalog versions differ.');
  if (manifest.name !== packageInfo.name) errors.push('Package and catalog names differ.');
  if (!Array.isArray(manifest.assets) || !manifest.assets.length) {
    errors.push('Catalog must contain an explicit non-empty assets array.');
    return errors;
  }
  const roots = {
    template: ['templates/'], knowledge: ['knowledge/'], guide: ['docs/'], skill: ['skills/'],
    agent: ['agents/'], mcp: ['mcp/'],
    host: ['.claude/', '.codex/', '.cursor/', '.opencode/', '.github/instructions/']
  };
  const seen = new Set();
  for (const asset of manifest.assets) {
    if (!asset || !safeRelative(asset.path) || seen.has(asset.path)) {
      errors.push(`Unsafe or duplicate asset: ${asset?.path}`);
      continue;
    }
    seen.add(asset.path);
    if (!Object.hasOwn(roots, asset.kind) || !roots[asset.kind].some(prefix => asset.path.startsWith(prefix))) {
      errors.push(`Invalid asset kind/path: ${asset.path}`);
    }
    if (asset.kind === 'host' && !['copilot', 'claude', 'codex', 'cursor', 'opencode'].includes(asset.assistant)) {
      errors.push(`Invalid host configuration: ${asset.path}`);
    }
    if (asset.kind === 'agent' && (typeof asset.description !== 'string' || !asset.description.trim())) {
      errors.push(`Missing agent description: ${asset.path}`);
    }
    if (asset.kind === 'skill' && !/^skills\/dotnet-[a-z0-9-]+\/SKILL\.md$/.test(asset.path)) {
      errors.push(`Invalid .NET skill path: ${asset.path}`);
    }
    try {
      let current = root;
      for (const part of asset.path.split('/')) {
        current = path.join(current, part);
        if ((await lstat(current)).isSymbolicLink()) throw new Error('symlink');
      }
      if (!(await stat(path.join(root, asset.path))).isFile()) errors.push(`Asset is not a file: ${asset.path}`);
    } catch (error) {
      errors.push(`${error.message === 'symlink' ? 'Symlink asset' : 'Missing asset'}: ${asset.path}`);
    }
  }
  if (!safeRelative(manifest.projectTemplate) || !manifest.projectTemplate.startsWith('templates/') ||
    !manifest.assets.some(asset => asset?.path === manifest.projectTemplate && asset.kind === 'template')) {
    errors.push('Project template is not cataloged.');
  }
  for (const assistant of ['copilot', 'claude', 'codex', 'cursor', 'opencode']) {
    if (!manifest.assets.some(asset => asset?.kind === 'host' && asset.assistant === assistant)) errors.push(`Missing host: ${assistant}`);
  }
  for (const file of await walk(root)) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    if ((await lstat(file)).isSymbolicLink()) {
      errors.push(`Symlink source: ${relative}`);
      continue;
    }
    if (/^(skills|agents|templates|knowledge|mcp|\.claude|\.codex|\.cursor|\.opencode)\//.test(relative) && !seen.has(relative)) {
      errors.push(`Uncataloged distributable asset: ${relative}`);
    }
    if (file.endsWith('.json')) {
      try {
        JSON.parse(await readFile(file, 'utf8'));
      } catch {
        errors.push(`Invalid JSON: ${relative}`);
      }
    }
    if (!file.endsWith('.md') && !file.endsWith('.mdc')) continue;
    const text = await readFile(file, 'utf8');
    if (path.basename(file) === 'SKILL.md') {
      const header = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const name = header?.[1].match(/^name: ([a-z0-9-]+)$/m)?.[1];
      if (!name || name !== path.basename(path.dirname(file))) errors.push(`Invalid skill name: ${file}`);
      const description = header?.[1].match(/^description: (.+)$/m)?.[1];
      if (!description || description.length > 1026) errors.push(`Missing or excessive skill description: ${file}`);
    }
    const withoutCode = text.replace(/```[\s\S]*?```/g, '');
    for (const match of withoutCode.matchAll(/\[[^\]]*\]\(([^\s)]+)\)/g)) {
      const target = match[1].split('#')[0];
      if (!target || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
      try {
        await stat(path.resolve(path.dirname(file), decodeURIComponent(target)));
      } catch {
        errors.push(`Broken link in ${path.relative(root, file)}: ${target}`);
      }
    }
  }
  return errors;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const errors = await validate();
    errors.forEach(error => console.error(error));
    if (errors.length) process.exitCode = 1;
    else console.log('Toolkit catalog coverage, JSON, skill metadata, and local links valid.');
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}