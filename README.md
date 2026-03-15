# capacitor-next-template

> Next.js + Capacitor 8 + Konsta UI + Tailwind CSS v4 — production-ready mobile app template

## Stack

- **Next.js 16** — App Router, static export (`output: 'export'`)
- **Capacitor 8** — iOS & Android native bridge
- **Konsta UI** — Mobile-first Tailwind components (iOS/Material style)
- **Tailwind CSS v4** — Utility-first styling
- **TypeScript 5** — Full type safety
- **pnpm** — Fast, disk-efficient package manager

Capacitor plugins included: `app`, `camera`, `keyboard`, `preferences`, `splash-screen`, `status-bar`

---

## Start a new app from this template

```bash
gh repo create my-new-app --template bsod700/capacitor-next-template --clone && cd my-new-app && pnpm install && pnpm setup
```

`pnpm setup` is an interactive CLI that handles everything:

1. Checks your environment (Java, Xcode, CocoaPods, adb)
2. Asks for your app name and auto-suggests the bundle ID
3. Adds Android and/or iOS platforms (yes/no)
4. Offers to open Android Studio or Xcode when done
5. Cleans itself up — the setup script removes itself from your app

---

## Development

```bash
pnpm dev                  # Next.js dev server at localhost:3000
pnpm build                # Static export to /out
pnpm typecheck            # TypeScript check
```

## Mobile

```bash
pnpm mobile               # Build + cap sync
pnpm mobile:android       # Build + sync + run on Android
pnpm mobile:ios           # Build + sync + run on iOS
pnpm mobile:android:studio  # Open in Android Studio
pnpm mobile:ios:studio      # Open in Xcode
```

### Live reload on device

```bash
pnpm mobile:live:android  # Dev server → Android device
pnpm mobile:live:ios      # Dev server → iOS device
```

---

## Keeping the template up to date

Dependencies are managed automatically via [Renovate Bot](https://github.com/apps/renovate). It opens PRs when any dependency releases a new version. CI validates every PR — merge when green.

### Releasing a new template version

```bash
pnpm release
# → interactive: pick patch / minor / major
# → bumps version, commits, tags, pushes
# → GitHub Release page is auto-generated
```

---

## How it works

Next.js is configured with `output: 'export'` which generates a fully static site into `/out`. Capacitor uses `/out` as its `webDir` and wraps it in a native iOS/Android shell. In development, Capacitor points to the live Next.js dev server via `DEV_HOST`.

```
Next.js (src/) → pnpm build → /out → cap sync → iOS / Android
```
