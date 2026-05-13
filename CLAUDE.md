# CLAUDE.md

## 1. Project Identity

Capacitor + Next.js hybrid app template targeting iOS, Android, and Web from a single codebase.
Static export only — `output: 'export'` in `next.config.ts`. No SSR, no server runtime, no API routes.
All rendering happens client-side; the `out/` directory is the deployable artifact loaded by Capacitor.

## 2. Tech Stack

- **Next.js 16** — App Router, `output: 'export'`, `trailingSlash: true`
- **React 19** + **TypeScript 6** strict mode
- **Konsta UI 5** — iOS/Material adaptive components (`konsta/react`)
- **Tailwind CSS v4** — CSS-first config via `postcss.config.mjs`, no `tailwind.config.*`
- **Capacitor 8** — native bridge; plugins: `@capacitor/app`, `@capacitor/camera`, `@capacitor/keyboard`, `@capacitor/preferences`, `@capacitor/splash-screen`, `@capacitor/status-bar`
- **pnpm 10** — the only allowed package manager (`packageManager: pnpm@10.29.3`)

## 3. Project Structure

```
src/
  app/
    globals.css       # Tailwind v4 import + global styles
    layout.tsx        # Root layout — mounts AppShell (KonstaProvider + theme detection)
    page.tsx          # Home page (Client Component)
  components/
    AppShell.tsx      # KonstaProvider wrapper + iOS/Material theme detection
  assets/             # Static images and icons (imported directly in components)
public/               # PWA manifest, favicon, logo (served as-is)
capacitor.config.ts   # Native app config (appId, plugins, live-reload server)
next.config.ts        # Static export config
postcss.config.mjs    # Tailwind v4 PostCSS integration
eslint.config.mjs     # ESLint flat config (eslint-config-next)
tsconfig.json         # Path alias @/* → ./src/*
scripts/              # setup.mjs — interactive project rename script
```

## 4. Commands

```bash
pnpm dev                    # Next.js dev server (web)
pnpm build                  # Static export → out/
pnpm start                  # Serve out/ locally (npx serve)
pnpm lint                   # ESLint
pnpm typecheck              # tsc --noEmit

pnpm mobile                 # build + cap sync (prepare native projects)
pnpm mobile:ios             # build + cap sync + cap run ios
pnpm mobile:android         # build + cap sync + cap run android
pnpm mobile:ios:studio      # build + cap sync + cap open ios (Xcode)
pnpm mobile:android:studio  # build + cap sync + cap open android (Android Studio)

pnpm mobile:live:ios        # Live reload on iOS device (no rebuild — injects DEV_HOST)
pnpm mobile:live:android    # Live reload on Android device (no rebuild — injects DEV_HOST)

pnpm setup                  # Interactive script to rename appId, appName, package name
pnpm release                # Bump version, tag, commit, and push
```

**Verification before claiming work is done:** `pnpm lint && pnpm typecheck`

## 5. Architecture Rules

- **All pages and components are Client Components.** Add `'use client'` at the top. There is no server runtime; do not omit this directive.
- **`AppShell` is the single `KonstaProvider` boundary.** It lives in `src/app/layout.tsx`. Never nest another `KonstaProvider` or create a second theme wrapper.
- **Theme detection (iOS vs Material) is owned by `AppShell.tsx`.** Do not replicate platform detection logic elsewhere.
- **Guard all Capacitor plugin calls** with `Capacitor.isNativePlatform()` — plugins throw on web without this check.
- **Always use the `@/*` path alias** (maps to `src/*`). Never use relative paths that cross directory boundaries (e.g. `../../components`).
- **Images must use `<img>` or `next/image` with `unoptimized`** — Next.js image optimisation is disabled in static export (`images: { unoptimized: true }`).
- **`out/` is the Capacitor `webDir`.** Never change `webDir` in `capacitor.config.ts` away from `out`.

## 6. Code Conventions

- **Named exports only.** No `export default function` except in `page.tsx` and `layout.tsx` — the Next.js framework requires default exports there. Everything else uses named exports.
- **Tailwind v4 syntax:** use `@import 'tailwindcss'` in CSS files. Do not use `@tailwind base/components/utilities` directives — those are v3.
- **Konsta imports:** `import { Page, Navbar, Block, ... } from 'konsta/react'`
- **Platform-specific logic belongs in hooks**, not inline in JSX. Create a `useCapacitor*` or `usePlatform` hook.
- **File naming:** `PascalCase.tsx` for components, `camelCase.ts` for utilities and hooks.
- **TypeScript:** strict mode is on. No `any`, no `@ts-ignore` without an explanation comment.

## 7. What NOT To Do

| Do not | Why |
|---|---|
| Add `'use server'` to any file | No server runtime exists in a static export |
| Use `next/headers`, `cookies()`, `headers()`, or any `server-only` import | Same — these APIs require a Node.js server |
| Use Server Actions (`action=` on forms or `'use server'` functions) | Not supported in static export |
| Run `npm install` or `yarn add` | This project uses `pnpm` exclusively; lockfile will break |
| Create `tailwind.config.ts` or `tailwind.config.js` | Tailwind v4 is CSS-first; a config file is not needed and conflicts |
| Install or import Ionic Framework / `@ionic/react` | This project uses **Konsta UI**, not Ionic |
| Commit `android/` or `ios/` directories | They are gitignored; always regenerated via `cap sync` |
| Use `generateServerSideProps`, `getServerSideProps`, or middleware that reads cookies | Server-only Next.js features — incompatible with `output: 'export'` |
| Nest `KonstaProvider` inside a page or component | Provider already exists in `AppShell` in the root layout |
| Use `next/image` without `unoptimized={true}` | Image optimisation is disabled in `next.config.ts` |
