import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { BrowserComponent } from './pages/browser/browser.component';
import { EditorComponent } from './pages/editor/editor.component';
import { LoginComponent } from './pages/login/login.component';
import { PlayerComponent } from './pages/player/player.component';
import { RoleGuardService } from './services/guards/RoleGuardService';
import { Role, RouteData } from './services/guards/types';

const userData: RouteData = { expectedRole: Role.user };
const guestData: RouteData = { expectedRole: Role.guest };

export const routes: Routes = [
  {
    path: 'player',
    component: PlayerComponent,
    data: userData,
    canActivate: [RoleGuardService],
  },
  {
    path: 'browser',
    component: BrowserComponent,
    data: userData,
    canActivate: [RoleGuardService],
  },
  {
    path: 'editor',
    component: EditorComponent,
    data: userData,
    canActivate: [RoleGuardService],
  },
  {
    path: 'about',
    component: AboutComponent,
    data: userData,
    canActivate: [RoleGuardService],
  },
  {
    path: 'login',
    component: LoginComponent,
    data: guestData,
    canActivate: [RoleGuardService],
  },
  { path: '**', redirectTo: 'player' },
];
