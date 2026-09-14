// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  loginEndPointAPI: "http://web1804.com/lisb-comfort-kit/web/v1/oauth/login",
  // feedbackEndPointAPI: "http://web1804.com/lisb-comfort-kit/web/v1/feedback",
  feedbackEndPointAPI: "https://sy61kbz415.execute-api.eu-central-1.amazonaws.com/devA/feedback",
  // notificationEndPointAPI: "http://web1804.com/lisb-comfort-kit/web/v1/notification",
  notificationEndPointAPI: "https://sy61kbz415.execute-api.eu-central-1.amazonaws.com/devA/notification",
  // weatherEndPointAPI: "http://web1804.com/lisb-comfort-kit/web/v1/weather",
  weatherEndPointAPI: "https://sy61kbz415.execute-api.eu-central-1.amazonaws.com/devA/weather",
  signupEndPointAPI: "http://web1804.com/lisb-comfort-kit/web/v1/signup",
  termsEndPointAPI: "http://web1804.com/lisb-comfort-kit/web/v1/resource/app-terms-conditions",
  cognitoUserPoolId: "eu-central-1_16JFq8XTg",
  cognitoClientId: "5vq2kfomf27dpu7lqt7hg7urg3",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
