import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthStatus, User } from './types';
import { catchError, EMPTY, map, shareReplay, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { UserInfoService } from './UserInfoService';

const COOKIE_NAME = 'auth_token';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authStatus = AuthStatus.Pending;
  private _authUrl = `${environment.backUrl}/auth/login`;
  private _loginUrl = `${environment.backUrl}/auth/me`;
  private _logoutUrl = `${environment.backUrl}/auth/logout`;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _userInfoService: UserInfoService
  ) {}

  auth = (): Observable<AuthStatus> => {
    if (this._authStatus === AuthStatus.Authorized) return of(this._authStatus);

    return this._http
      .get<User | null>(this._loginUrl, {
        withCredentials: true,
      })
      .pipe(
        map((result) => {
          this._authStatus = AuthStatus.Authorized;
          this._userInfoService.setUserInfo(result);
          return this._authStatus;
        }),
        catchError((e: HttpErrorResponse, caught) => {
          this._authStatus = AuthStatus.Unauthorized;
          this._userInfoService.setUserInfo(null);
          return of(this._authStatus);
        })
      );
  };

  logout = () => {
    if (this._authStatus === AuthStatus.Unauthorized)
      return of(this._authStatus);

    return this._http
      .get<User | null>(this._logoutUrl, {
        withCredentials: true,
      })
      .pipe(
        map(() => {
          this._authStatus = AuthStatus.Unauthorized;
          this._userInfoService.setUserInfo(null);
          this._router.navigate(['login']);
          return this._authStatus;
        }),
        catchError((e: HttpErrorResponse, caught) => {
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
}
