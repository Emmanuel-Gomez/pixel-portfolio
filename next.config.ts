import type { NextConfig } from 'next';

// Static export: `next build` writes a plain static site to `out/`,
// which Cloudflare (wrangler.jsonc) and Vercel can both serve.
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
