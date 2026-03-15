#!/usr/bin/env node
import * as p from '@clack/prompts';
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// ── Guard: already configured ──────────────────────────────────────────────
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
if (pkg.name !== 'my-app') {
  p.cancel(`Already configured as "${pkg.name}". Run pnpm setup only once.`);
  process.exit(0);
}

p.intro(`  New Capacitor App Setup  ·  template v${pkg.version}`);

// ── Phase 1: Environment check ─────────────────────────────────────────────
function has(cmd) {
  try { execSync(cmd, { stdio: 'ignore' }); return true; }
  catch { return false; }
}

const env = {
  java:  has('java -version'),
  adb:   has('adb version'),
  xcode: has('xcode-select -p'),
  pod:   has('pod --version'),
};

p.log.step('Checking your environment...');
p.log.info(`  Java (JDK)    ${env.java  ? '✓' : '✗  not found — install JDK 17+'}`);
p.log.info(`  Android (adb) ${env.adb   ? '✓' : '✗  not found — install Android Studio'}`);
p.log.info(`  Xcode         ${env.xcode ? '✓' : '✗  not found — install Xcode from App Store'}`);
p.log.info(`  CocoaPods     ${env.pod   ? '✓' : '✗  not found — run: sudo gem install cocoapods'}`);

// ── Phase 2: Questions ─────────────────────────────────────────────────────
const appName = await p.text({
  message: 'What is your app name?',
  placeholder: 'My App',
  validate: v => !v.trim() ? 'App name is required' : undefined,
});
if (p.isCancel(appName)) { p.cancel('Setup cancelled.'); process.exit(0); }

const slug = appName.toLowerCase().replace(/[^a-z0-9]/g, '');

const appId = await p.text({
  message: 'Bundle ID (reverse-domain format)?',
  initialValue: `com.yourcompany.${slug}`,
  validate: v => !/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,}$/.test(v)
    ? 'Format: com.company.app (lowercase, no spaces)' : undefined,
});
if (p.isCancel(appId)) { p.cancel('Setup cancelled.'); process.exit(0); }

const android = env.java
  ? await p.confirm({ message: 'Add Android platform?', initialValue: true })
  : (p.log.warn('Skipping Android — Java not found.'), false);
if (p.isCancel(android)) { p.cancel('Setup cancelled.'); process.exit(0); }

const ios = env.xcode
  ? await p.confirm({ message: 'Add iOS platform?', initialValue: true })
  : (p.log.warn('Skipping iOS — Xcode not found.'), false);
if (p.isCancel(ios)) { p.cancel('Setup cancelled.'); process.exit(0); }

// ── Phase 3: Patch config files ────────────────────────────────────────────
const s = p.spinner();
s.start('Updating config files...');

// capacitor.config.ts
let capConfig = readFileSync('capacitor.config.ts', 'utf8');
capConfig = capConfig.replace("appId: 'com.template.app'", `appId: '${appId}'`);
capConfig = capConfig.replace("appName: 'MyApp'", `appName: '${appName}'`);
writeFileSync('capacitor.config.ts', capConfig);

// package.json — snapshot templateVersion, reset version, set name
const updatedPkg = JSON.parse(readFileSync('package.json', 'utf8'));
updatedPkg.templateVersion = updatedPkg.version;
updatedPkg.version = '1.0.0';
updatedPkg.name = slug || 'my-app';
writeFileSync('package.json', JSON.stringify(updatedPkg, null, 2) + '\n');

// public/manifest.json
const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8'));
manifest.name = appName;
manifest.short_name = appName;
writeFileSync('public/manifest.json', JSON.stringify(manifest, null, 2) + '\n');

// src/app/layout.tsx
let layout = readFileSync('src/app/layout.tsx', 'utf8');
layout = layout.replace(/title: 'My App'/g, `title: '${appName}'`);
layout = layout.replace(/description: 'My App'/g, `description: '${appName}'`);
writeFileSync('src/app/layout.tsx', layout);

// src/app/page.tsx
let page = readFileSync('src/app/page.tsx', 'utf8');
page = page.replace('<Navbar title="My App" />', `<Navbar title="${appName}" />`);
writeFileSync('src/app/page.tsx', page);

s.stop('Config files updated');

// ── Phase 4: Add platforms ─────────────────────────────────────────────────
if (android) {
  s.start('Adding Android platform (this may take ~30s)...');
  execSync('npx cap add android', { stdio: 'pipe' });
  s.stop('Android platform added');
}
if (ios) {
  s.start('Adding iOS platform (this may take ~30s)...');
  execSync('npx cap add ios', { stdio: 'pipe' });
  s.stop('iOS platform added');
}

// ── Phase 5: Open in IDE ───────────────────────────────────────────────────
const ideOptions = [
  ...(android ? [{ value: 'android', label: 'Open Android Studio' }] : []),
  ...(ios     ? [{ value: 'ios',     label: 'Open Xcode'           }] : []),
  { value: 'none', label: 'Skip — I will open it myself' },
];

if (ideOptions.length > 1) {
  const openIde = await p.select({ message: 'Open in IDE now?', options: ideOptions });
  if (!p.isCancel(openIde)) {
    if (openIde === 'android') execSync('npx cap open android', { stdio: 'inherit' });
    if (openIde === 'ios')     execSync('npx cap open ios',     { stdio: 'inherit' });
  }
}

// ── Phase 6: Self-cleanup ──────────────────────────────────────────────────
s.start('Removing setup scaffolding...');
const cleanPkg = JSON.parse(readFileSync('package.json', 'utf8'));
delete cleanPkg.devDependencies['@clack/prompts'];
delete cleanPkg.scripts['setup'];
writeFileSync('package.json', JSON.stringify(cleanPkg, null, 2) + '\n');
execSync('pnpm install --silent', { stdio: 'pipe' });
unlinkSync(__filename);
s.stop('Scaffolding removed — app is clean');

p.outro(`You're all set!  App: ${appName}  ·  ID: ${appId}`);
