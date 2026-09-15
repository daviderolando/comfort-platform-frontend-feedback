# Gist: Deploy to Firebase

- [Gist: Deploy to Firebase](#gist-deploy-to-firebase)
  - [Gist (one-line)](#gist-one-line)
    - [Troubleshooting](#troubleshooting)
  - [Gist (init)](#gist-init)
  - [Gist](#gist)
  - [Brainstorming](#brainstorming)

---

## Gist (one-line)

```bash
# Build & deploy
ng build --configuration=production && firebase deploy
npm install -g firebase-tools && ng build --configuration=production && firebase deploy
ng build --configuration=development && firebase deploy # This will not compress files and will take the env from dev
# Firebase Hosting must point to: dist/frontend-feedback/browser
# Production API base URL: https://ettlabserverapi.duckdns.org/comfortplatform/api/v1
# The production build replaces src/environments/environment.ts with src/environments/environment.prod.ts.
# Project Console: https://console.firebase.google.com/project/comfort-app-6adda/overview
# Hosting URL: https://comfort-app-6adda.web.app

# Upgrade firebase tools
npm install -g firebase-tools

# Git release version
VERSION=$(node -p "require('./package.json').version")
echo "Releasing version $VERSION"
git tag -a v$VERSION -m "Release version $VERSION"
git push origin v$VERSION
```

### Troubleshooting

```sh
firebase login --reauth
firebase use comfort-app-6adda
firebase deploy
```

## Gist (init)

```bash
ng build --configuration=production # To generate the dist folder (useful setting up firebase)
firebase login
firebase init hosting
# Choose existing project
# Project: Choose the Firebase project you created.
# Firebase Hosting: Select "yes" to enable Firebase Hosting.
# Public directory: dist/frontend-feedback/browser
  # NB: Angular 21 emits browser assets in the nested `browser` folder.
# Single-page app: Select "yes" if your app is a single-page application.
# Rewrite URLs: Select "yes" to rewrite all URLs to index.html.

# This will create the following files
firebase.json
.firebaserc

# Deploy the app
firebase deploy
# Project Console: https://console.firebase.google.com/project/comfort-app-6adda/overview
# Hosting URL: https://comfort-app-6adda.web.app
```

## Gist

```bash
npm install -g firebase-tools

# firebase logout
firebase login

firebase init hosting

# Firebase project
# https://console.firebase.google.com/project/labbett/overview

# Public directory: dist/frontend
# Single-page app: Y
# Rewrite URLs: Y

# Build
ng build

# Deploy
firebase deploy

# Visit: https://labbett.web.app

# One line build and deploy
ng build && firebase deploy
```

## Brainstorming

I'd be glad to provide a step-by-step markdown guide on how to publish your Angular app to Firebase:

**Prerequisites:**

- An Angular app created and configured.
- A Firebase account and project set up.
- Node.js and npm (or yarn) installed on your system.
- The Angular CLI installed globally (`npm install -g @angular/cli`).

**Steps:**

1. **Install Firebase CLI:**

   ```bash
   npm install -g firebase-tools
   ```

2. **Log in to Firebase:**

   ```bash
   firebase login
   ```

   This will open a browser window for you to authenticate with your Google account.

3. **Initialize Firebase Project:**

   ```bash
   firebase init
   ```

   Follow the prompts to select the Firebase project you want (in case of Angular app: `Hosting`) to use and configure your app:

   - **Project:** Choose the Firebase project you created.
   - **Firebase Hosting:** Select "yes" to enable Firebase Hosting.
   - **Public directory:** Specify the directory where your Angular app's build artifacts are located (e.g., `dist/your-app-name`).
   - **Single-page app:** Select "yes" if your app is a single-page application.
   - **Rewrite URLs:** Select "yes" to rewrite all URLs to index.html.

4. **Build Your Angular App:**

   ```bash
   ng build
   ```

   This will create the build artifacts in the specified directory.

5. **Deploy to Firebase:**

   ```bash
   firebase deploy
   ```

   This will deploy your Angular app to Firebase Hosting. You'll see a URL where your app is now accessible.

**Additional Tips:**

- **Configuration:** You can customize your Firebase Hosting configuration by editing the `firebase.json` file in your project's root directory.
- **Hosting target:** If Firebase says it found only a couple of files and shows the Firebase welcome page, check that `firebase.json` uses `"public": "dist/frontend-feedback/browser"` rather than `"public": "public"`.
- **Production backend:** The production Angular build uses `src/environments/environment.prod.ts`, currently pointing to `https://ettlabserverapi.duckdns.org/comfortplatform/api/v1`.
- **Environment Variables:** Store sensitive data (e.g., API keys) in environment variables and access them in your Angular app using the `environment.ts` file.
- **Continuous Deployment:** Set up continuous deployment using tools like GitHub Actions or Firebase CI/CD to automatically deploy your app whenever you push changes to your repository.
