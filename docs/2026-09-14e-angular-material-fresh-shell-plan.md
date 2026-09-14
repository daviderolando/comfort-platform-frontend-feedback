# Angular Material Fresh Shell Plan

## Summary

Create a fresh Angular 21 LTS application shell with Angular Material, then migrate only the useful parts of the current Angular 11 feedback app. This is likely cleaner than incrementally upgrading the old project because the current app is small and most complexity is old tooling, Bootstrap layout, deprecated test/lint setup, and legacy dependency constraints.

Keep the existing Angular 11 project and the incremental upgrade plan for reference until the new shell is fully working.

## Target

- Angular 21 LTS.
- Angular Material for UI.
- Module-based app structure is acceptable, but a new Angular app may default to standalone components; follow the Angular 21 default unless there is a clear reason not to.
- No Bootstrap or Popper.
- Same FastAPI backend contract.
- Mobile-first feedback workflow remains the main user journey.

## Backend Contract To Preserve

- `POST /api/v1/auth/login`
  - Body: `{ "username": "...", "password": "..." }`
  - Response includes `access_token`, `token_type`, and `user`.
- `GET /api/v1/feedback-options`
  - Public endpoint for available feedback buttons.
- `POST /api/v1/feedback`
  - Protected endpoint.
  - Uses bearer token to identify the user.
  - Body includes `codename`, optional `intensity`, optional `comment`, and optional `extra`.

Demo login:

- `davide / demo`
- `federico / demo`
- `felix / demo`
- `hamid / demo`
- `marco / demo`

## Proposed App Structure

- `auth`
  - Login page.
  - Auth service.
  - Token persistence in local storage.
  - HTTP interceptor adding `Authorization: Bearer <token>`.
- `feedback`
  - Main feedback page.
  - Loads button options from `GET /feedback-options`.
  - Allows immediate submit for `everything_ok`.
  - Opens intensity/comment form for other feedback types.
- `layout`
  - Material toolbar.
  - Navigation links.
  - Logged-in/logout state.
- `notifications`
  - Placeholder page for now.
- `data`
  - Placeholder page for now.
- `terms`
  - Placeholder/static page for now.

## UI Direction

- Use `mat-toolbar` for the app header.
- Use large `mat-raised-button` controls for feedback buttons.
- Use `mat-button-toggle-group` for intensity: Low, Medium, High.
- Use `mat-form-field` and `matInput` for comments and login fields.
- Use `mat-snack-bar` for success/error feedback.
- Keep the feedback page centered, simple, and touch-friendly.
- Preserve the current color semantics:
  - `everything_ok`: green
  - cold/humid: blue
  - warm/dry: red
  - air quality: gray
  - noise: yellow

## Implementation Steps

1. Create a new Angular 21 app shell beside the existing app, for example `frontend-feedback-material`.
2. Add Angular Material during setup.
3. Configure environment files with `apiBaseUrl`.
4. Implement routing for login, feedback, notifications, data, terms.
5. Implement auth service and HTTP interceptor.
6. Implement feedback service using backend endpoints.
7. Build the Material feedback UI.
8. Add simple route guards so feedback/data/notifications require login.
9. Keep signup as a placeholder until the backend signup model is designed.
10. Build and manually test the login plus feedback submission workflow.
11. When stable, decide whether to replace `frontend-feedback` or keep both temporarily.

## Test Plan

- `npm install`
- `npm run build`
- `npm start`
- Login with `davide / demo`.
- Submit `Everything Ok!`.
- Submit one feedback with intensity and comment, for example `Too warm`.
- Confirm requests include `Authorization: Bearer <token>`.
- Confirm backend stores the feedback for the logged-in user.
- Run the backend Bruno collection as a secondary API smoke test.

## Assumptions

- Fresh shell is preferred over incremental upgrade.
- The old Angular 11 app remains available as a reference during migration.
- The new app can use Angular 21 defaults, including standalone components, unless a specific project convention argues against it.
- Notifications, data, signup, and terms do not need full feature parity in the first fresh-shell pass.
- The first success milestone is login plus protected feedback submission.
