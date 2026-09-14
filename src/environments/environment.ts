// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: "http://localhost:8000/api/v1",
  feedbackUserId: 1,
  loginEndPointAPI: "http://localhost:8000/api/v1/auth/login",
  feedbackEndPointAPI: "http://localhost:8000/api/v1/feedback",
  feedbackOptionsEndPointAPI: "http://localhost:8000/api/v1/feedback-options",
  notificationEndPointAPI: "http://localhost:8000/api/v1/notifications",
  weatherEndPointAPI: "http://localhost:8000/api/v1/weather",
  signupEndPointAPI: "http://localhost:8000/api/v1/signup",
  termsEndPointAPI: "http://localhost:8000/api/v1/terms",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
