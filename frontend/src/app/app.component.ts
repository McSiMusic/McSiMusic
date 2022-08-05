import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/AuthService';
import { AuthStatus } from 'src/app/services/types';
import { PortalType } from './services/portal/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  PortalTypeEnum = PortalType;
  constructor(private _http: HttpClient, private _authService: AuthService) {}

  get isAuthorized() {
    return this._authService.authStatus === AuthStatus.Authorized;
  }

  get isPending() {
    return this._authService.authStatus === AuthStatus.Pending;
  }
}
