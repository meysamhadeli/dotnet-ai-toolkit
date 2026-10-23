import { createHash } from 'node:crypto';
import { lstat, mkdir, readFile, realpath, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { safeRelative, toolkitRoot, validate } from './validate.mjs';

export const hosts = {
  copilot: { source: '.github/instructions/dotnet-consumer.instructions.md', entry: '.github/copilot-instructions.md', skills: '.github/skills', agents: '.github/agents', agentExtension: '.agent.md' },
  claude: { source: '.claude/CLAUDE.md', entry: 'CLAUDE.md', skills: '.claude/skills', agents: '.claude/agents', agentExtension: '.md' },
  codex: { source: '.codex/AGENTS.md', entry: 'AGENTS.md', skills: '.agents/skills' },
  cursor: { source: '.cursor/rules/dotnet.mdc', entry: '.cursor/rules/dotnet.mdc', skills: '.cursor/skills' },
  opencode: { source: '.opencode/AGENTS.md', entry: 'AGENTS.md', skills: '.opencode/skills' }
};

async function inspect(location) {
  try {
    return await lstat(location);
  } catch (error) {
    if (error.code === 'ENOENT') return undefined;
    throw error;
  }
}

function contains(parent, child) {
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}

async function inspectDestination(root, relative) {
  if (!safeRelative(relative)) throw new Error(`Unsafe destination: ${relative}`);
  const parts = relative.split('/');
  let current = root;
  for (const [index, part] of parts.entries()) {
    current = path.join(current, part);
    const info = await inspect(current);
    if (info?.isSymbolicLink()) throw new Error(`Refusing symlink: ${relative}`);
    if (info && index < parts.length - 1 && !info.isDirectory()) throw new Error(`Parent is not a directory: ${relative}`);
    if (info && index === parts.length - 1 && !info.isFile()) throw new Error(`Destination is not a file: ${relative}`);
  }
}

export function renderAgent(asset, text, assistant) {
  const name = path.posix.basename(asset.path, '.md');
  const tools = assistant === 'copilot' ? '[read, search]' : '[Read, Grep, Glob]';
  return `---\nname: ${name}\ndescription: ${JSON.stringify(asset.description)}\ntools: ${tools}\n---\n\n${text}`;
}

export async function install({ target, assistant, dryRun = false, source = toolkitRoot }) {
  if (!Object.hasOwn(hosts, assistant)) throw new Error(`Assistant must be ${Object.keys(hosts).join(', ')}.`);
  const host = hosts[assistant];
  if (!target) throw new Error('An existing target directory is required.');
  const targetInfo = await inspect(path.resolve(target));
  if (!targetInfo?.isDirectory() || targetInfo.isSymbolicLink()) throw new Error('Target must be an existing non-symlink directory.');
  const root = await realpath(target);
  const sourceRoot = await realpath(source);
  if (contains(sourceRoot, root) || contains(root, sourceRoot)) throw new Error('Target must be separate from the toolkit checkout.');
  const errors = await validate(sourceRoot);
  if (errors.length) throw new Error(`Invalid toolkit:\n${errors.join('\n')}`);
  const manifestText = await readFile(path.join(sourceRoot, 'toolkit.json'), 'utf8');
  const manifest = JSON.parse(manifestText);
  const entries = new Map();
  function add(destination, content) {
    if (!safeRelative(destination) || entries.has(destination)) throw new Error(`Unsafe or duplicate destination: ${destination}`);
    entries.set(destination, content);
  }
  add('.ai-toolkit/toolkit.json', manifestText);
  add('.ai-toolkit/LICENSE', await readFile(path.join(sourceRoot, 'LICENSE'), 'utf8'));
  for (const asset of manifest.assets) {
    const text = await readFile(path.join(sourceRoot, asset.path), 'utf8');
    add(`.ai-toolkit/${asset.path}`, text);
    if (asset.kind === 'skill') {
      add(`${host.skills}/${asset.path.slice('skills/'.length)}`, text);
    }
    if (asset.kind === 'agent' && host.agents) {
      const name = path.posix.basename(asset.path, '.md');
      add(`${host.agents}/${name}${host.agentExtension}`, renderAgent(asset, text, assistant));
    }
    if (asset.kind === 'host' && asset.assistant === assistant) {
      const destination = asset.path === host.source ? host.entry : asset.path;
      add(destination, text);
      if (asset.path === host.source && destination !== asset.path) add(asset.path, text);
    }
  }
  const receipt = {
    schemaVersion: 1, toolkit: manifest.name, version: manifest.version, assistant,
    files: [...entries].map(([destination, content]) => ({
      path: destination, sha256: createHash('sha256').update(content).digest('hex')
    }))
  };
  add(`.ai-toolkit/receipts/${assistant}.json`, `${JSON.stringify(receipt, null, 2)}\n`);
  const plan = [];
  for (const [destination, content] of entries) {
    await inspectDestination(root, destination);
    const location = path.join(root, destination);
    const existing = await inspect(location);
    if (existing && !(await readFile(location)).equals(Buffer.from(content))) {
      throw new Error(`Conflict: ${destination}. Existing files are never overwritten; review and merge manually.`);
    }
    plan.push({ path: destination, action: existing ? 'unchanged' : 'create' });
  }
  if (!dryRun) {
    for (const item of plan) {
      if (item.action === 'unchanged') continue;
      await inspectDestination(root, item.path);
      const location = path.join(root, item.path);
      await mkdir(path.dirname(location), { recursive: true });
      await writeFile(location, entries.get(item.path), { flag: 'wx' });
    }
  }
  return plan;
}

export function parseArguments(args) {
  const options = {};
  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument === '--help') return { help: true };
    if (argument === '--dry-run') {
      options.dryRun = true;
      continue;
    }
    if (!['--target', '--assistant'].includes(argument) || !args[index + 1] || args[index + 1].startsWith('--')) {
      throw new Error(`Unknown or incomplete argument: ${argument}`);
    }
    const key = argument.slice(2);
    if (options[key]) throw new Error(`Duplicate argument: ${argument}`);
    options[key] = args[++index];
  }
  return options;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const options = parseArguments(process.argv.slice(2));
    if (options.help) {
      console.log(`node scripts/install.mjs --target <existing-directory> --assistant <${Object.keys(hosts).join('|')}> [--dry-run]`);
    } else {
      const plan = await install(options);
      plan.forEach(item => console.log(`${item.action}: ${item.path}`));
      console.log(`${options.dryRun ? 'Dry run' : 'Installation'} complete. No hooks or MCP servers activated.`);
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}