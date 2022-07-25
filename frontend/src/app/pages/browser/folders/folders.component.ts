import { Component, OnInit } from '@angular/core';
import { UserInfoService } from 'src/app/services/UserInfoService';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss'],
})
export class FoldersComponent {
  constructor(private _userInfoService: UserInfoService) {}
  foldersLoading = false;

  private get _currentFolder() {
    return this._userInfoService.currentFolder.value;
  }

  isCurrentFolder = (folder: string) => {
    return this._currentFolder === folder;
  };

  get folders() {
    return this._userInfoService.folders;
  }
}
