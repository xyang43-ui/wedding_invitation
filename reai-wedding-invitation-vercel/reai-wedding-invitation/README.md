# 熱愛 — Wedding Invitation

This is a standalone Next.js export of the bilingual wedding invitation. It preserves the current artwork, typography, animations, transitions, decorative effects, tap interactions, typewriter behavior, and Chinese/English switching.

The project has no RSVP form, database, login, analytics, backend API, or ChatGPT-specific hosting dependency. All artwork and fonts are stored locally in `public/`; there are no temporary asset URLs. The current invitation does not use music or audio, so no audio files are required.

## Requirements

- Node.js 20.9 or newer (Node.js 22 LTS recommended)
- npm

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To test a production build:

```bash
npm run build
npm run start
```

## Deploy to Vercel

### Option A: Vercel website

1. Put this folder in a GitHub, GitLab, or Bitbucket repository.
2. Sign in to [Vercel](https://vercel.com) and choose **Add New → Project**.
3. Import the repository.
4. Keep the detected framework as **Next.js** and leave the build settings at their defaults.
5. Click **Deploy**.

No environment variables are needed.

### Option B: Vercel CLI

```bash
npm install
npx vercel
```

For the production deployment:

```bash
npx vercel --prod
```

## Folder structure

```text
app/
  layout.tsx              Page metadata and document shell
  page.tsx                Invitation content and interactions
  globals.css             Layout, animation, and responsive styling
  invitation-fonts.css    Local font declarations
public/
  fonts/                  Bundled Chinese and English webfonts
  *.png                   Invitation artwork and decorative assets
  favicon.svg             Browser icon
package.json              Runtime and build dependencies
next.config.ts            Standard Next.js configuration
tsconfig.json             TypeScript configuration
```

## Editing notes

- Text, language switching, cover cycling, and typewriter timing are in `app/page.tsx`.
- Layout, sizes, spacing, transitions, and decorative motion are in `app/globals.css`.
- Font declarations are in `app/invitation-fonts.css`, and the matching `.woff2` files are in `public/fonts/`.
- Artwork paths are root-relative (for example `/01-cover.png`) and are served from `public/`.
