# Emmanuel Gomez — Pixel Portfolio

A scroll-driven pixel-art career journey, built with [Next.js](https://nextjs.org) (App Router, TypeScript) and exported as a static site.

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Build

```bash
npm run build
```

`next build` uses `output: 'export'`, so the finished static site lands in `out/`. You can preview it with `npm start`.

## Deploy

- **Cloudflare:** `npm run deploy` builds and runs `wrangler deploy`, which serves `out/` (see `wrangler.jsonc`).
- **Vercel:** import the repo. It detects Next.js automatically, and `@vercel/analytics` is wired up in `app/layout.tsx`.

## Project layout

- `app/layout.tsx`: HTML shell, metadata, analytics
- `app/page.tsx`: home page
- `app/globals.css`: all styling, responsive layout and sprite positioning
- `app/icon.svg`: favicon
- `components/Journey.tsx`: page markup, English/Swedish switching, and the scroll/animation engine
- `lib/content.ts`: career chapters, translations, background environments and contact details
- `lib/trailDog.ts`: the French bulldog companion animation
- `public/assets/`: city panoramas and sprite sheets

## Edit content

In `lib/content.ts`, edit `chapters` for your experience, `environments` for the backgrounds,
and `contact` for your email and LinkedIn URL.
