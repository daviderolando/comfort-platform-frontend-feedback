import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthResponse, UserSession } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 'ComfortApp.userSession';
  private readonly sessionSubject = new BehaviorSubject<UserSession | null>(this.readStoredSession());

  readonly session$ = this.sessionSubject.asObservable();

  get session(): UserSession | null {
    return this.sessionSubject.value;
  }

  get accessToken(): string | null {
    return this.session?.accessToken ?? null;
  }

  get isLoggedIn(): boolean {
    return !!this.accessToken;
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, { username, password })
      .pipe(tap((response) => this.storeSession(response)));
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.sessionSubject.next(null);
  }

  private storeSession(response: AuthResponse): void {
    const session: UserSession = {
      accessToken: response.access_token,
      user: response.user,
    };
    localStorage.setItem(this.storageKey, JSON.stringify(session));
    this.sessionSubject.next(session);
  }

  private readStoredSession(): UserSession | null {
    const rawSession = localStorage.getItem(this.storageKey);
    if (!rawSession) {
      return null;
    }

    try {
      const session = JSON.parse(rawSession) as UserSession;
      if (session.user.role !== 'admin' && session.user.role !== 'tenant') {
        localStorage.removeItem(this.storageKey);
        return null;
      }
      return session;
    } catch {
      localStorage.removeItem(this.storageKey);
      return null;
    }
  }
}
