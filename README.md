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

## Creating a new app from this template

### Prerequisites

Make sure you have these installed before starting:

| Tool | Why | Install |
|------|-----|---------|
| [Node.js 22+](https://nodejs.org) | Runtime | `brew install node` |
| [pnpm](https://pnpm.io) | Package manager | `npm i -g pnpm` |
| [GitHub CLI](https://cli.github.com) | Clone the template | `brew install gh` |
| [Xcode](https://apps.apple.com/app/xcode/id497799835) | iOS development | App Store |
| [Android Studio](https://developer.android.com/studio) | Android development | Download |
| [JDK 17+](https://adoptium.net) | Required for Android | `brew install temurin` |
| [CocoaPods](https://cocoapods.org) | iOS dependencies | `sudo gem install cocoapods` |

> You only need Xcode for iOS and Android Studio + JDK for Android. You can skip either if you're targeting one platform only.

---

### Step 1 — Authenticate GitHub CLI (first time only)

```bash
gh auth login
```

Follow the prompts — it opens your browser to authorize. Do this once and you're set forever.

---

### Step 2 — Create your new app

Run this single command (replace `my-new-app` with your repo name):

```bash
gh repo create my-new-app --template bsod700/capacitor-next-template --clone && cd my-new-app && pnpm install && pnpm setup
```

This will:
- Create a new GitHub repo from the template
- Clone it to your machine
- Install all dependencies
- Launch the interactive setup wizard

---

### Step 3 — Answer the setup questions

The setup wizard walks you through everything:

```
  New Capacitor App Setup  ·  template v1.0.0

  Checking your environment...
  Java (JDK)    ✓
  Android (adb) ✓
  Xcode         ✓
  CocoaPods     ✓

◆  What is your app name?
│  Travel App

◆  Bundle ID (reverse-domain format)?
│  com.yourcompany.travelapp   ← auto-suggested, just edit "yourcompany"

◆  Add Android platform?
│  ● Yes / ○ No

◆  Add iOS platform?
│  ● Yes / ○ No

◇  Config files updated
◇  Android platform added
◇  iOS platform added

◆  Open in IDE now?
│  ● Open Xcode
│  ○ Open Android Studio
│  ○ Skip

  You're all set!  App: Travel App  ·  ID: com.yourcompany.travelapp
```

> Any tool that's missing will be detected automatically and its platform option will be skipped with a clear message — no crashes.

---

### Step 4 — Run your app

```bash
pnpm mobile:android   # run on Android device / emulator
pnpm mobile:ios       # run on iOS device / simulator
pnpm dev              # web browser at localhost:3000
```

That's it — your app is running.

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
