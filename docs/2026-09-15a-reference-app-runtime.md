# Reference App Runtime

The old Angular 11 app is kept as a reference while the new Angular Material shell is developed.

Use Node `20.18.0` for this app:

```sh
cd /Users/drolando/Documents/Dev/kth/kth-comfort-platform/frontend-feedback
nvm use
npm start
```

Do not run this Angular 11 app with Node 24. Its old Webpack dev-server stack still touches Node's removed `http_parser` binding and fails with:

```text
No such module: http_parser
```

The new Angular 21 Material shell uses Node `24.21.0` instead:

```sh
cd /Users/drolando/Documents/Dev/kth/kth-comfort-platform/frontend-feedback-material
nvm use
npm start
```

If both apps need to run at the same time, run the old app on another port:

```sh
npm start -- --port 4202 --host 127.0.0.1
```
