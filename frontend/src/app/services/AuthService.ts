import { Injectable, signal } from '@angular/core';
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
  readonly authStatus = signal(AuthStatus.Pending);
  private _authUrl = `${environment.backUrl}/auth/login`;
  private _loginUrl = `${environment.backUrl}/auth/me`;
  private _logoutUrl = `${environment.backUrl}/auth/logout`;

  constructor(
    private _http: HttpClient,
    private _router: Router,
    private _userInfoService: UserInfoService
  ) {}

  auth = (): Observable<AuthStatus> => {
    if (this.authStatus() === AuthStatus.Authorized)
      return of(this.authStatus());

    return this._http
      .get<User | null>(this._loginUrl, {
        withCredentials: true,
      })
      .pipe(
        map((result) => {
          this.authStatus.set(AuthStatus.Authorized);
          this._userInfoService.setUserInfo(result);
          return this.authStatus();
        }),
        catchError((e: HttpErrorResponse, caught) => {
          this.authStatus.set(AuthStatus.Unauthorized);
          this._userInfoService.setUserInfo(null);
          return of(this.authStatus());
        })
      );
  };

  logout = () => {
    if (this.authStatus() === AuthStatus.Unauthorized)
      return of(this.authStatus());

    return this._http
      .get<User | null>(this._logoutUrl, {
        withCredentials: true,
      })
      .pipe(
        map(() => {
          this.authStatus.set(AuthStatus.Unauthorized);
          this._userInfoService.setUserInfo(null);
          this._router.navigate(['login']);
          return this.authStatus();
        }),
        catchError((e: HttpErrorResponse, caught) => {
          return of(this.authStatus());
        })
      );
  };

  get authUrl() {
    return this._authUrl;
  }
}
