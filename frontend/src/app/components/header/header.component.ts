import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PortalType } from 'src/app/services/portal/types';
import { UserInfoService } from 'src/app/services/UserInfoService';
import { MenuItem } from 'src/app/ui-components/menu/types';
import { AuthService } from '../../services/AuthService';
import { PortalService } from '../../services/portal/PortalService';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuComponent } from '../../ui-components/menu/menu.component';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [RouterLink, RouterLinkActive, MenuComponent]
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
        this._portalService.clear(PortalType.Dropdown);
      },
      name: 'Logout',
    },
  ];

  get userPicture() {
    return this._userInfoService.userInfo?.picture;
  }

  ngOnInit(): void {}
}
