import { Component, OnInit } from '@angular/core';
import { UserInfoService } from 'src/app/services/UserInfoService';
import { MenuItem } from 'src/app/ui-components/menu/types';
import { AuthService } from '../../services/AuthService';
import { PortalService } from '../../services/portal/PortalService';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private _authService: AuthService,
    private _userInfoService: UserInfoService,
    private _portalService: PortalService
  ) {}

  elements: MenuItem[] = [
    {
      action: () => {
        this._authService.logout().subscribe();
        this._portalService.clear();
      },
      name: 'Logout',
    },
  ];

  get userPicture() {
    return this._userInfoService.userInfo?.picture;
  }

  ngOnInit(): void {}
}
