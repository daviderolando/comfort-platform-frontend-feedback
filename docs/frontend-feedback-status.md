# Frontend Feedback Status

Reviewed on 2026-09-14.

`frontend-feedback` is now the correct Angular 11 feedback app, named `ng-feedback-app`. It contains the intended mobile-first flow where authenticated users tap large buttons for comfort feedback: `all-good`, `too-cold`, `too-warm`, `too-humid`, `too-dry`, `poor-air-quality`, and `too-noisy`.

Current features include Cognito-based auth, signup/confirmation screens, the feedback form with optional intensity/comment, notification handling, user feedback charts, weather charts, terms page, Bootstrap styling, service worker/PWA config, and old Amplify metadata.

`npm run build` currently fails because `node_modules` is missing: Angular cannot find `@angular-devkit/build-angular:browser`. After installing dependencies, the next check should be whether Angular 11 still builds under the current Node version.

Restart notes:

- Development endpoints point to AWS API Gateway for feedback, notifications, and weather, while login/signup/terms still point to the old `web1804.com` backend.
- Production endpoints point entirely to the old `web1804.com` backend and do not include the Cognito pool/client values used by `AuthService`.
- The auth interceptor attaches a Cognito token to every HTTP request, so public endpoints may need to be excluded before login/signup/terms are reliable.
- Deployment scripts still target old S3 buckets in `package.json`.
