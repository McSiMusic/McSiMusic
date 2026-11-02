import { Component, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from './services/AuthService';
import { AuthStatus } from 'src/app/services/types';
import { PortalType } from './services/portal/types';
import { PreloaderComponent } from './components/preloader/preloader.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterOutlet } from '@angular/router';
import { PortalRootDirective } from './services/portal/PortalRoot';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [PreloaderComponent, HeaderComponent, RouterOutlet, PortalRootDirective]
})
export class AppComponent {
  PortalTypeEnum = PortalType;
  constructor(private _authService: AuthService) {}

  get isAuthorized() {
    return this._authService.authStatus() === AuthStatus.Authorized;
  }

  get isPending() {
    return this._authService.authStatus() === AuthStatus.Pending;
  }
}
