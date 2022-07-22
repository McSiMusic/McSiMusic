import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../AuthService';
import { AuthStatus } from '../types';
import { Role, RouteData } from './types';
import { EMPTY, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuardService implements CanActivate {
  constructor(public _authService: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    return this._authService.auth().pipe(
      map((status) => {
        const data = route.data as RouteData;

        if (
          data.expectedRole === Role.user &&
          status === AuthStatus.Unauthorized
        ) {
          this.router.navigate(['login']);
          return false;
        }

        if (
          data.expectedRole === Role.guest &&
          status === AuthStatus.Authorized
        ) {
          this.router.navigate(['player']);
          return false;
        }
        return true;
      })
    );
  }
}
