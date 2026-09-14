import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User, SignUpResult } from './user.model';
import { environment } from '../../environments/environment';

export interface AuthResponseData {
  access_token: string;
  token_type: string;
  user: {
    id: number;
    username: string;
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  authIsLoading = new BehaviorSubject<boolean>(false);
  authDidFail = new BehaviorSubject<boolean>(false);
  authError = new BehaviorSubject<string>('');
  authStatusChanged = new Subject<boolean>();

  user = new BehaviorSubject<User>(null);

  localId: string;
  token: string;
  email: string;
  expiresIn: number;

  APP_TOKEN = 'ComfortApp.accessToken';
  APP_DATA = 'ComfortApp.userData';

  constructor(private router: Router, private http: HttpClient) {}

  signUp(username: string, password: string, email: string): Observable<SignUpResult> {
    return of({
      status: false,
      username: username,
      userId: '',
      token: '',
      expirationTime: 0,
      error: 'Not implemented yet',
    });
  }

  confirmUser(username: string, code: string) {
    window.alert('Not implemented yet. Account confirmation will be connected to the FastAPI backend later.');
  }

  signIn(username: string, password: string): Observable<AuthResponseData> {
    return this.http
      .post<AuthResponseData>(environment.loginEndPointAPI, {
        username: username,
        password: password,
      })
      .pipe(
        tap((responseData) => {
          this.handleAuthentication(responseData);
        }),
        catchError(this.handleError)
      );
  }

  getAuthenticatedUser() {
    return this.user.value;
  }

  getSessionToken() {
    const currentUser = this.user.value;
    return of(currentUser ? currentUser.token : null);
  }

  logout() {
    this.authStatusChanged.next(false);
    this.removeLocalData();
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  isAuthenticated(): Observable<boolean> {
    return of(!!this.user.value);
  }

  initAuth() {
    this.authStatusChanged.next(!!this.user.value);
  }

  autoLogin() {
    const userData = localStorage.getItem(this.APP_DATA);
    if (!userData) {
      this.user.next(null);
      return;
    }

    const parsedData = JSON.parse(userData);
    const loadedUser = new User(
      parsedData.username,
      parsedData.id,
      parsedData._token,
      parsedData._refreshToken || '',
      parsedData._tokenExpirationTime
    );

    if (loadedUser.token) {
      this.user.next(loadedUser);
    } else {
      this.removeLocalData();
      this.user.next(null);
    }
  }

  autoLogout(expirationDuration: number) {
    return;
  }

  isLoggedIn() {
    return !!this.user.value;
  }

  removeLocalData() {
    localStorage.removeItem(this.APP_DATA);
    localStorage.removeItem(this.APP_TOKEN);
  }

  private handleAuthentication(responseData: AuthResponseData) {
    const expirationTime = Math.floor(new Date().getTime() / 1000) + 24 * 60 * 60;
    const user = new User(
      responseData.user.username,
      responseData.user.id.toString(),
      responseData.access_token,
      '',
      expirationTime
    );

    this.user.next(user);
    this.authStatusChanged.next(true);
    localStorage.setItem(this.APP_TOKEN, responseData.access_token);
    localStorage.setItem(this.APP_DATA, JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    if (errorRes.error && errorRes.error.detail) {
      return throwError(errorRes.error.detail);
    }
    return throwError('Login failed.');
  }
}
