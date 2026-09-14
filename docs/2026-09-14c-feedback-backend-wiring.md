# Feedback Backend Wiring

The feedback screen now sends real feedback submissions to the FastAPI backend.

Essential contract:

- Development API base: `http://localhost:8000/api/v1`
- Feedback submit endpoint: `POST /feedback`
- Feedback options endpoint available for later dynamic UI work: `GET /feedback-options`
- Button codenames now match the backend catalog: `everything_ok`, `too_cold`, `too_warm`, `too_humid`, `too_dry`, `poor_air_quality`, `noise`

Authentication:

- Login now calls `POST /auth/login`.
- The frontend stores the returned bearer token in local storage.
- API requests to the FastAPI backend automatically include `Authorization: Bearer <token>`.
- Feedback submission no longer sends `user_id`; the backend uses the logged-in user from the token.

Demo users seeded in the backend:

- `davide`
- `federico`
- `felix`
- `hamid`
- `marco`

All demo users currently use password `demo`.

Run locally:

```sh
# backend
.venv/bin/uvicorn src.main:app --reload

# frontend-feedback
npm start
```
