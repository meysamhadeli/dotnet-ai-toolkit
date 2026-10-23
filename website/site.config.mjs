export const repository = 'https://github.com/meysamhadeli/dotnet-ai-toolkit';
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '/dotnet-ai-toolkit';

if (basePath && !/^\/[a-zA-Z0-9_-]+(?:\/[a-zA-Z0-9_-]+)*$/.test(basePath)) {
  throw new Error('NEXT_PUBLIC_BASE_PATH must be empty or a slash-prefixed path without a trailing slash.');
}

export const siteUrl = `https://meysamhadeli.github.io${basePath}`;
