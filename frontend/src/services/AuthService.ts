import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isLoggedIn = false;
  private _authUrl = `${environment.backUrl}/auth`;
  constructor(private _httpClient: HttpClient) {}

  get isLoggenIn() {
    return this._isLoggedIn;
  }

  get authUrl() {
    return this._authUrl;
  }
}
