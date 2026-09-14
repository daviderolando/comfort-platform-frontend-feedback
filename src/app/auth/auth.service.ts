import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';

import { User, SignUpResult } from './user.model';

export interface AuthResponseData {
  localId: string;
  token: string;
  email: string;
  expiresIn: number;
  registered?: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService implements AuthResponseData {
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

  constructor(private router: Router) {}

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

  signIn(username: string, password: string) {
    return of(null);
  }

  getAuthenticatedUser() {
    return null;
  }

  getSessionToken() {
    return of(null);
  }

  logout() {
    this.authStatusChanged.next(false);
    this.removeLocalData();
    this.user.next(null);
    this.router.navigate(['/auth']);
  }

  isAuthenticated(): Observable<boolean> {
    return of(false);
  }

  initAuth() {
    this.authStatusChanged.next(false);
  }

  autoLogin() {
    this.user.next(null);
  }

  autoLogout(expirationDuration: number) {
    return;
  }

  isLoggedIn() {
    return false;
  }

  removeLocalData() {
    localStorage.removeItem(this.APP_DATA);
    localStorage.removeItem(this.APP_TOKEN);
  }
}
