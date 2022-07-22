import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthStatus, User } from './types';
import { catchError, EMPTY, map, shareReplay, Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const COOKIE_NAME = 'auth_token';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authStatus = AuthStatus.Pending;
  private _authUrl = `${environment.backUrl}/auth`;
  private _loginUrl = `${environment.backUrl}/auth/me`;
  private _userInfo: User | null = null;

  constructor(private _httpClient: HttpClient, private _router: Router) {}

  auth = (): Observable<AuthStatus> => {
    if (this._authStatus === AuthStatus.Authorized) return of(this._authStatus);

    return this._httpClient
      .get<User | null>(this._loginUrl, {
        withCredentials: true,
        observe: 'response',
      })
      .pipe(
        map((r) => {
          this._authStatus = AuthStatus.Authorized;
          this._userInfo = r.body;
          return this._authStatus;
        }),
        catchError((e: HttpErrorResponse, caught) => {
          this._authStatus = AuthStatus.Unauthorized;
          this._userInfo = null;
          return of(this._authStatus);
        })
      );
  };

  get authStatus() {
    return this._authStatus;
  }

  get authUrl() {
    return this._authUrl;
  }

  get userInfo() {
    return this._userInfo;
  }
}
