# Fresh Shell Status

`frontend-feedback` now contains the Angular 21 + Angular Material frontend shell for the comfort feedback workflow on the `dev` branch.

Implemented first workflow:

- Login with the FastAPI backend at `POST /api/v1/auth/login`.
- Store the bearer token in local storage.
- Attach `Authorization: Bearer <token>` to FastAPI requests.
- Protect feedback, notifications, and data routes behind login.
- Load feedback buttons from `GET /api/v1/feedback-options`.
- Render the canonical local feedback buttons immediately, then update from `GET /api/v1/feedback-options` when available.
- Submit feedback to protected `POST /api/v1/feedback`.
- Show the Data page with `ng2-charts`/Chart.js bar charts for:
  - `GET /api/v1/feedback/summary/me?days=7`
  - `GET /api/v1/feedback/summary/building?days=7`
- Fall back to zero-count Data charts if the summary request fails or hangs.
- Use a compact Material toolbar with a burger menu on mobile widths.
- Hide the Notifications section from the navigation until that workflow is needed again.
- Show the Data summaries inside Material tabs:
  - feedback icon tab for `My feedbacks`
  - building icon tab for `My building`
  - admin icon tab for admin users
- Keep the Data refresh action as an icon button aligned with the page title.
- Admin users can use the Data admin tab to choose a building and period:
  - `24h`
  - `3 days`
  - `7 days`
  - `14 days`
  - `30 days`
- Show an `Admin` section only when the logged-in user has `role: "admin"`.
- The Admin page can filter by building and browse received feedback, including comments, in a Material table.
- Terms page contains prototype terms and conditions, including the KTH Live-In Lab project background links.

Demo credentials from the backend seed data:

- `davide / demo`
- `federico / demo`
- `felix / demo`
- `hamid / demo`
- `marco / demo`

Run locally:

```sh
cd /Users/drolando/Documents/Dev/kth/kth-comfort-platform/frontend-feedback
PATH=/Users/drolando/.nvm/versions/node/v24.21.0/bin:$PATH npm start
```

Backend must also be running:

```sh
cd /Users/drolando/Documents/Dev/kth/kth-comfort-platform/backend
.venv/bin/uvicorn src.main:app --reload
```

The development frontend points to `http://127.0.0.1:8000/api/v1` to avoid localhost IPv4/IPv6 ambiguity during browser testing.

Current placeholders:

- Signup

If the old Angular app is already running on port `4200`, Angular may offer to run this shell on `4201`. The backend CORS configuration allows both ports for local development.

Build note:

- Production font optimization is disabled in `angular.json` because Angular otherwise tries to fetch Google Fonts during local builds.
- The production bundle budget was raised to account for Chart.js and the Material tab/menu components.
