import { Component, OnInit } from '@angular/core';
import { without } from 'lodash';
import { UserInfoService } from 'src/app/services/UserInfoService';
import { Folder, FolderStatus } from './types';

@Component({
  selector: 'app-folders',
  templateUrl: './folders.component.html',
  styleUrls: ['./folders.component.scss'],
})
export class FoldersComponent {
  constructor(private _userInfoService: UserInfoService) {
    this.folders = this._userInfoService.folders!.map((name) => ({
      name,
      status: FolderStatus.Idle,
    }));
  }
  foldersLoading = false;
  folders: Folder[] = [];

  private get _currentFolder() {
    return this._userInfoService.currentFolder.value;
  }

  isCurrentFolder = (folder: string) => {
    return this._currentFolder === folder;
  };

  createFolder = () => {
    this.folders.push({ name: 'New folder', status: FolderStatus.Editing });
  };

  isEditing = (folder: Folder) => {
    return folder.status === FolderStatus.Editing;
  };

  onEditCompleted = (value: string) => {
    this._userInfoService.addFolder(value).subscribe();
    const editingFolder = this.folders.find(
      (f) => f.status === FolderStatus.Editing
    );
    if (editingFolder === undefined) return;
    editingFolder.name = value;
    editingFolder.status = FolderStatus.Idle;
  };

  deleteFolder(value: Folder) {
    this._userInfoService.deleteFolder(value.name).subscribe();
    this.folders = without(this.folders, value);
  }
}
