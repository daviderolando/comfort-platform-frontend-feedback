# Angular LTS + Material Upgrade Plan

## Summary

Upgrade `frontend-feedback` from Angular 11 to the latest Angular LTS, which is Angular 21 as of September 14, 2026. Angular 22 is active support, but not LTS. Angular 21 supports Node `^20.19.0`, `^22.12.0`, or `^24.0.0`.

The current local Node is `20.18.0`, which is below Angular 21's supported Node 20 range and is also end-of-life. Upgrade the Mac to the latest Node LTS first. As of September 14, 2026, the current Node LTS line is Node 24 "Krypton"; the latest listed LTS release is `v24.21.0`.

Sources:

- [Angular releases](https://angular.dev/reference/releases)
- [Angular version compatibility](https://angular.dev/reference/versions)
- [Node.js releases](https://nodejs.org/en/about/previous-releases)
- [Node.js release schedule](https://github.com/nodejs/Release)

## Key Changes

- Upgrade Angular incrementally from 11 to 21 using `ng update` one major version at a time.
- Remove Bootstrap and Popper from `package.json`, `angular.json`, and `src/styles.css`.
- Add Angular Material, Angular CDK, and Material animations support.
- Replace Bootstrap UI patterns with Angular Material:
  - Navbar: `mat-toolbar`
  - Feedback buttons: `mat-button` or `mat-raised-button`
  - Login/signup forms: `mat-form-field`, `mat-input`, `mat-button`
  - Alerts: `mat-snack-bar` or inline Material-styled messages
  - Intensity selector: `mat-button-toggle-group`
- Keep the app module-based for this upgrade; do not convert to standalone components yet.
- Keep backend API contract unchanged:
  - `POST /api/v1/auth/login`
  - `POST /api/v1/feedback`
  - `GET /api/v1/feedback-options`

## Implementation Steps

- Upgrade local Node to the latest Node 24 LTS before changing Angular.
- Remove the old `NODE_OPTIONS=--openssl-legacy-provider` workaround after Angular/Webpack upgrade.
- Run Angular CLI updates sequentially from v11 to v21.
- Resolve TypeScript, RxJS, builder, service worker, and browserlist changes at each checkpoint.
- Install Angular Material for Angular 21.
- Add a minimal custom Material theme.
- Replace Bootstrap classes in templates with Material components and lightweight CSS layout.
- Preserve the current mobile-first feedback screen and large tappable controls.
- Remove Bootstrap CSS import, Bootstrap JS bundle, `bootstrap`, and `@popperjs/core`.

## Mac Node Upgrade Steps

First identify how Node is currently installed:

```sh
which node
node -v
which npm
npm -v
command -v nvm
brew list --versions node node@20 node@22 node@24
```

Use exactly one upgrade path below.

### Recommended Path: nvm

Use this path if `command -v nvm` prints a path or function.

```sh
nvm install --lts
nvm use --lts
nvm alias default lts/*
node -v
npm -v
which node
```

Expected result: `node -v` should print a Node 24 LTS version, for example `v24.21.0` or newer within the Node 24 LTS line.

Then reinstall frontend dependencies from a clean state:

```sh
cd /Users/drolando/Documents/Dev/kth/kth-comfort-platform/frontend-feedback
rm -rf node_modules package-lock.json
npm install
npm run build

# For old Angular versions (v11-v20)
npm install --legacy-peer-deps
npm run build
# If that works, we can make it persistent during the upgrade by adding a local .npmrc:
echo 'legacy-peer-deps=true' >> .npmrc
```

### Homebrew Path

Use this path if `which node` points under `/opt/homebrew` or `/usr/local`, or if `brew list --versions node` shows Node installed by Homebrew.

```sh
brew update
brew install node@24
brew unlink node
brew link --overwrite --force node@24
node -v
npm -v
which node
```

If the shell still finds the old Node, add the Homebrew Node 24 path to the shell profile and restart the terminal:

```sh
echo 'export PATH="/opt/homebrew/opt/node@24/bin:$PATH"' >> ~/.zshrc
exec zsh
node -v
```

On older Intel Macs, use this path instead:

```sh
echo 'export PATH="/usr/local/opt/node@24/bin:$PATH"' >> ~/.zshrc
exec zsh
node -v
```

Then reinstall frontend dependencies:

```sh
cd /Users/drolando/Documents/Dev/kth/kth-comfort-platform/frontend-feedback
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Official Installer Path

Use this path if `which node` points to `/usr/local/bin/node` and neither `nvm` nor Homebrew appears to manage Node.

1. Download the macOS LTS installer from [nodejs.org](https://nodejs.org/).
2. Choose the Node 24 LTS installer.
3. Run the installer.
4. Open a new terminal and verify:

```sh
node -v
npm -v
which node
```

Then reinstall frontend dependencies:

```sh
cd /Users/drolando/Documents/Dev/kth/kth-comfort-platform/frontend-feedback
rm -rf node_modules package-lock.json
npm install
npm run build
```

Do not keep multiple active Node managers fighting for the shell path. If `node -v` is still `v20.18.0` after upgrading, inspect `which node` and fix the PATH before starting the Angular upgrade.

Angular 11 checkpoint note:

- Use `npm install --legacy-peer-deps` while the app is still Angular 11.
- Keep `typescript` pinned to `~4.1.6`; Angular 11 compiler CLI requires TypeScript `>=4.0 <4.2`.
- Do not run `npm audit fix --force` at this stage because it can jump dependencies across Angular major-version boundaries.

## Test Plan

- After each major Angular update, run:

```sh
npm install
npm run build
```

- Final verification:
  - Run `npm start`.
  - Login with `davide / demo`.
  - Submit at least one feedback button.
  - Confirm the backend accepts the request with the bearer token.
  - Run the backend Bruno smoke workflow if needed.
- Fix or remove obsolete Angular 11 specs that block the upgrade without adding useful coverage.

## Assumptions

- Target version is Angular 21 because the request says latest Angular LTS.
- Angular 22 is intentionally not selected because it is active support, not LTS.
- The app remains a simple Angular SPA, not a full redesign or rewrite.
- Signup, notifications, data, and terms can remain functional placeholders unless needed for build compatibility.
- Angular Material replaces Bootstrap visually, but the current backend wiring and feedback workflow remain the priority.
