# Frontend Feedback Dev Plan

Goal: revive the small mobile-first feedback app without AWS dependencies. The frontend should eventually talk to the FastAPI backend, but for the first runnable checkpoint all backend actions are local placeholders.

Phase 1: runnable interface

- Install Angular 11 dependencies with a compatible Node version.
- Keep the existing feedback, login, signup, notification, data, and terms screens navigable.
- Disable AWS/Cognito/API calls in the active UI.
- Show a simple `Not implemented yet` alert for login, signup, confirmation, feedback submit, and notification updates.
- Use static placeholder data for charts and terms content.

Phase 2: remove old AWS surface

- Remove Cognito, Amplify, AWS SDK, S3 deploy scripts, and old Amplify files once the app builds.
- Replace the auth model with the FastAPI approach selected for the backend.
- Keep endpoint configuration under `environment.ts` and `environment.prod.ts`, using `http://localhost:8000` for development.

Phase 3: connect FastAPI

- Implement frontend services for login/session, feedback submission, notifications, terms, and optional chart/weather data.
- Add request/response interfaces matching the FastAPI schemas.
- Re-enable route protection only after local auth/session handling is working.
- Add focused tests for feedback submission, auth state, and basic navigation.
