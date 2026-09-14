# Frontend Feedback Status

Reviewed on 2026-09-14.

`frontend-feedback` is now the correct Angular 11 feedback app, named `ng-feedback-app`. It contains the intended mobile-first flow where authenticated users tap large buttons for comfort feedback: `all-good`, `too-cold`, `too-warm`, `too-humid`, `too-dry`, `poor-air-quality`, and `too-noisy`.

Current features include auth/signup/confirmation screens, the feedback form with optional intensity/comment, notification handling, user feedback charts, weather charts, terms page, Bootstrap styling, service worker/PWA config, and old Amplify metadata.

`npm run build` currently fails because `node_modules` is missing: Angular cannot find `@angular-devkit/build-angular:browser`. After installing dependencies, the next check should be whether Angular 11 still builds under the current Node version.

Restart notes from the recovered app:

- The app previously mixed AWS API Gateway, Cognito, Amplify metadata, old `web1804.com` endpoints, and S3 deployment scripts.
- The first restart step is to run the interface with local placeholders only.
- The next backend target is FastAPI, configured from `environment.ts` and `environment.prod.ts`.
