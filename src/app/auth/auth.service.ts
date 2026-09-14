import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Pipe, PipeTransform } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { throwError, Subject, BehaviorSubject, Subscription, of, Observable, Observer } from 'rxjs';

import { User, SignUpResult, UserSession } from './user.model';
import { environment } from '../../environments/environment';
import { catchError, map, take, tap } from 'rxjs/operators';
import { NotificationService } from '../notification/notification.service';

import { AuthenticationDetails, CognitoUser, CognitoUserAttribute, CognitoUserPool, CognitoUserSession, CognitoRefreshToken } from 'amazon-cognito-identity-js';
// import * as AWS from 'aws-sdk/global';

// The data format that the API endpoint will return
export interface AuthResponseData {
  localId: string;
  token: string;
  email: string;
  expiresIn: number;
  registered?: boolean;
}

// AWS Cognito
const poolData = {
  UserPoolId: environment.cognitoUserPoolId, //'eu-central-1_JHkYLQ87m', // Your user pool id here
  ClientId: environment.cognitoClientId, //'6sat5bn58s6o6ciikesbii5c5q', // Your client id here
};
const userPool = new CognitoUserPool(poolData);

@Injectable({ providedIn: 'root' })
export class AuthService implements AuthResponseData {

  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authError = new BehaviorSubject<string>('');
  authStatusChanged = new Subject<boolean>();

  user = new BehaviorSubject<User>(null);
  registeredUser: CognitoUser;
  signupObs: Observable<any>;
  private tokenExpirationTimer: any;

  localId: string;
  token: string;
  email: string;
  expiresIn: number;

  // apiLoginUrl = environment.loginEndPointAPI + environment.myAPIkey;
  apiLoginUrl = environment.loginEndPointAPI;

  APP_TOKEN = 'ComfortApp.accessToken';
  APP_DATA = 'ComfortApp.userData';
  APP_DATA_AWS = 'ComfortApp.appData';

  constructor(
    private http: HttpClient,
    private router: Router,
  ) { }

  // SignUp User with Cognito
  signUp(user: string, password: string, email: string) {

    // https://stackoverflow.com/questions/49934800/aws-cognito-serializationexception-start-of-structure-or-map-found-where-not

    let attributeList = [];

    const dataEmail = {
      Name: 'email',
      Value: email
      // Value: "davide.rolando@gmail.com"
    };

    const attributeEmail = new CognitoUserAttribute(dataEmail);

    attributeList.push(attributeEmail);

    console.log(user, password);
    console.log(attributeList);

    // User Pool SignUp
    const obs = new Observable((observer: Observer<any>) => {

      userPool.signUp(user, password, attributeList, null, ((err, result) => {
        // userPool.signUp('davide',  'Testpass99', attributeList, null, ((err, result) => {
        if (err) {
          // alert(err.message || JSON.stringify(err));
          // console.log('There was an error ', JSON.stringify(err));
          observer.error(err);
          return err;
        }
        // console.log('You have successfully signed up, please confirm your email ');
        // console.log(result);

        // Observer next
        observer.next(result);
        return result;
      }))

    }).pipe(
      catchError(this.handleSignUpError),
      map(result => {

        // Instantiate a cognitoUser variable
        let cognitoUser = result.user;
        this.registeredUser = result.user;
        console.log('Username: ' + cognitoUser.getUsername());

        // Collect information from positive response
        const signupResult: SignUpResult = {
          status: true,
          username: result.user.username,
          userId: result.user.pool.userSub,
          token: '',
          expirationTime: 0,
        }
        return signupResult;
      }),
      tap(result => {
        // Set new user (BehaviourSubject)
        // const user = new User(result.username, result.userId, result.token, result.expirationTime);
        // this.user.next(user);
      })
    );

    return obs;
  }

  // Cognito User Pool: Confirm User
  confirmUser(username: string, code: string) {
    this.authIsLoading.next(true);
    const userData = {
      Username: username,
      Pool: userPool
    };
    const cognitoUser = new CognitoUser(userData);
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        this.authDidFail.next(true);
        return;
      }
      this.authDidFail.next(false);
      this.authIsLoading.next(false);
      // Navigate away
      this.router.navigate(['/auth']);
    });
  }

  // Cognito User Pool: SignIn
  signIn(username: string, password: string) {
    this.authIsLoading.next(true);
    const authData = {
      Username: username,
      Password: password
    };

    // Added
    const authDetails = new AuthenticationDetails(authData);
    const userData = {
      Username: username,
      Pool: userPool
    }
    const cognitoUser = new CognitoUser(userData);

    const obs = new Observable((observer: Observer<CognitoUserSession>) => {
      // const that = this;
      cognitoUser.authenticateUser(authDetails, {
        onSuccess(result: CognitoUserSession) {
          observer.next(result);
          // return result;
        },
        onFailure(err) {
          observer.error(err);
          this.authDidFail.next(true);
          this.authIsLoading.next(false);
          // return err;
        },
      });
    }).pipe(
      catchError(this.handleSignUpError),
      map(result => {
        return result;
      }),
      tap(result => {
        this.authStatusChanged.next(true);
        this.authDidFail.next(false);
        this.authIsLoading.next(false);

        // Create User and emit event
        const payloadIdToken = result.getIdToken().decodePayload();
        const payloadAccessToken = result.getAccessToken().decodePayload();

        const sessionData: UserSession = {
          username: payloadAccessToken.username,
          userId: payloadAccessToken.sub,
          accessToken: result.getAccessToken().getJwtToken(),
          idToken: result.getIdToken().getJwtToken(),
          refreshToken: result.getRefreshToken().getToken(),
          clockDrift: 0,
          expirationTime: payloadAccessToken.exp,
        }

        // Add here an API call to retrieve information about the user profile
        // Is city set?
        // Is the apartment set?
          // If city, apartment, ... are not set then the page "data" should not be accessible
        // Does the user have comfort-boxes? Which ones?

        this.handleAuthenticationSession(sessionData, result);
      })
    );

    return obs;
  }

  // Cognito User Pool: Get Authenticated User
  getAuthenticatedUser() {
    return userPool.getCurrentUser();
  }

  // Return Observable carrying the authToken
  getSessionToken () {
    return new Observable( (observer: Observer<any>) => {

      this.getAuthenticatedUser().getSession((err, session) => {
        if (err) {
          observer.error(err);
          // return err;
        }

        console.log("🚀 ~ file: feedback.service.ts ~ line 43 ~ FeedbackService ~ this.authService.getAuthenticatedUser ~ session", session);
        const authToken = session.getIdToken().getJwtToken();
        observer.next(authToken);
        // return authToken;
      });
    })
  }

  // Cognito User Pool: Log Out
  logout() {
    // console.log('this.getAuthenticatedUser().getSignInUserSession()', this.getAuthenticatedUser().getSignInUserSession());
    this.getAuthenticatedUser().signOut();
    this.authStatusChanged.next(false);

    // localStorage.removeItem('userData');
    this.removeLocalData();

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;

    this.user.next(null);
    this.router.navigate(['/auth']);

  }

  // Cognito User Pool: isAuthenticated Observable
  isAuthenticated(): Observable<boolean> {
    // Check if user is available through getAuthenticatedUser()
    const user = this.getAuthenticatedUser();
    console.log("🚀 ~ file: auth.service.ts ~ line 263 ~ AuthService ~ isAuthenticated ~ user", user)
    // Check if token and app data is available in the local storage
    const appData = JSON.parse(localStorage.getItem(this.APP_DATA));
    // console.log("🚀 ~ file: auth.service.ts ~ line 311 ~ AuthService ~ isAuthenticated ~ appData", appData)

    const obs = new Observable((observer: Observer<boolean>) => {
      if (!user && !appData) {
        observer.next(false);
      } else {
        // observer.next(false);
        user.getSession((err, session) => {
          if (err) {
            observer.next(false);
          } else {
            if (session.isValid()) {
              observer.next(true);
            } else {
              observer.next(false);
            }
          }
        });
      }
      observer.complete();
    });
    return obs;
  }

  // Cognito User Pool: Init Authentication
  initAuth() {
    this.isAuthenticated().subscribe((auth) => {
      console.log('initAuth');
      console.log(auth);
      this.authStatusChanged.next(auth);
    });
  }

  // Custom method for handling authentication
  private handleAuthenticationSession(sessionData: UserSession, cognitoUserSession: CognitoUserSession) {
    // const expirationTime = new Date().getTime() + expiresIn * 1000;
    const user = new User(sessionData.username, sessionData.userId, sessionData.accessToken, sessionData.refreshToken, sessionData.expirationTime);
    // console.log("🚀 ~ file: auth.service.ts ~ line 361 ~ AuthService ~ handleAuthenticationSession ~ user", user)
    this.user.next(user);
    // this.autoLogout(expiresIn * 1000);

    // Set localStorage
    localStorage.setItem(this.APP_DATA, JSON.stringify(sessionData));
    localStorage.setItem(this.APP_DATA_AWS, JSON.stringify(cognitoUserSession));
    localStorage.setItem(this.APP_TOKEN, JSON.stringify(user.token));
  }


  autoLogin() {
    const sessionData: UserSession = JSON.parse(localStorage.getItem(this.APP_DATA));
    // console.log("🚀 ~ file: auth.service.ts ~ line 407 ~ AuthService ~ autoLogin ~ sessionData", sessionData)

    if (!sessionData) {
      return;
    }

    const loadedUser = new User(
      sessionData.username, sessionData.userId, sessionData.accessToken, sessionData.refreshToken, sessionData.expirationTime
    );
    // console.log("🚀 ~ file: auth.service.ts ~ line 414 ~ AuthService ~ autoLogin ~ loadedUser", loadedUser)

    // Does the User have a valid token?
    if (loadedUser.token) {
      // Emit the user
      this.user.next(loadedUser);
    }

    // Set autologout
    // const nowUnixDate = new Date().getTime();
    // this.autoLogout(nowUnixDate - (userData._tokenExpirationTime * 1000));
    const expirationDuration = (loadedUser.tokenExpirationTime * 1000 - new Date().getTime());
    // console.log("🚀 ~ file: auth.service.ts ~ line 463 ~ AuthService ~ autoLogin ~ expirationDuration", expirationDuration)
    this.autoLogout(expirationDuration);
  }

  autoLogout(expirationDuration: number) {
    // console.log("🚀 ~ file: auth.service.ts ~ line 468 ~ AuthService ~ autoLogout ~ expirationDuration", expirationDuration)

    if (expirationDuration < 0) {
      this.logout();
    }

    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      // }, 5000);
    }, expirationDuration);
    // }, 2000);
  }

  // Method that handles error
  private handleSignUpError(errorRes: HttpErrorResponse) {
    console.log('handleSignUpError / errorRes');

    let errorObj = JSON.parse(JSON.stringify(errorRes));
    console.log(errorObj);

    let errorMessage = 'An unknown error occurred.';

    if (!errorObj.name || !errorObj.code) {
      return throwError(errorMessage);
    }
    // switch (errorObj.error.error.message) {
    switch (errorObj.code) {
      case 'UsernameExistsException':
        errorMessage =
          'Username already exists';
        break;
      default:
        errorMessage = 'Authentication error';
        break;
    }
    // Emit event for authError
    this.authError.next(errorMessage);
    return throwError(errorMessage);
  }

  isLoggedIn() {
    return !!JSON.parse(localStorage.getItem(this.APP_TOKEN));
  }

  removeLocalData() {
    localStorage.removeItem(this.APP_DATA);
    localStorage.removeItem(this.APP_DATA_AWS);
    localStorage.removeItem(this.APP_TOKEN);
  }
}
