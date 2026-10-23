import nextra from 'nextra';
import { fileURLToPath } from 'node:url';
import { basePath } from './site.config.mjs';

const withNextra = nextra({ search: { codeblocks: false } });

export default withNextra({
  output: 'export',
  outputFileTracingRoot: fileURLToPath(new URL('.', import.meta.url)),
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false
});
