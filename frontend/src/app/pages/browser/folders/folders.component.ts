import { Component, OnInit, ViewChild } from '@angular/core';
import { without } from 'lodash';
import { UserInfoService } from 'src/app/services/UserInfoService';
import { Folder, FolderStatus } from './types';
import { BlurEvent } from '../../../ui-components/input/types';
import { InputComponent } from 'src/app/ui-components/input/input.component';

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
  @ViewChild(InputComponent) input?: InputComponent;

  private get _currentFolder() {
    return this._userInfoService.currentFolder.value;
  }

  isCurrentFolder = (folder: Folder) => {
    return this._currentFolder === folder.name;
  };

  createFolder = () => {
    this.folders.push({ name: 'New folder', status: FolderStatus.Creating });
  };

  isEditing = (folder: Folder) => {
    return (
      folder.status === FolderStatus.Editing ||
      folder.status === FolderStatus.Creating
    );
  };

  onBlur = (event: BlurEvent, folder: Folder) => {
    const { isEsc, isEnter, value } = event;

    if (!isEsc && !isEnter) {
      return;
    }

    if (isEsc) {
      this.folders = without(this.folders, folder);
    } else {
      this._addFolder(value, folder);
    }
  };

  private _addFolder = (value: string, folder: Folder) => {
    if (!this._isInputValueValid()) return;
    folder.name = value;
    folder.status = FolderStatus.Idle;
    folder.status = FolderStatus.Loading;
    this._userInfoService.addFolder(value).subscribe((folders) => {
      folder.status = FolderStatus.Idle;
      this._userInfoService.currentFolder.next(folder.name);
    });
  };

  private _patchFolder = (value: string, folder: Folder) => {
    if (!this._isInputValueValid()) return;
    if (value.toLowerCase() === folder.name.toLowerCase()) {
      folder.status = FolderStatus.Idle;
      return;
    }

    const oldValue = folder.name;
    folder.name = value;
    folder.status = FolderStatus.Loading;
    this._userInfoService.patchFolder(value, folder.name).subscribe(() => {
      if (this._userInfoService.currentFolder.value === oldValue) {
        this._userInfoService.currentFolder.next(folder.name);
      }
      folder.status = FolderStatus.Idle;
    });
  };

  deleteFolder(folder: Folder) {
    folder.status = FolderStatus.Loading;

    this._userInfoService.deleteFolder(folder.name).subscribe((folders) => {
      this.folders = without(this.folders, folder);
      if (this.isCurrentFolder(folder)) {
        const newCurrentFolder = this.folders.filter(
          (f) => f.status === FolderStatus.Idle
        )[0];
        this._userInfoService.currentFolder.next(newCurrentFolder.name);
      }
    });
  }

  startEditFolder(value: Folder) {
    value.status = FolderStatus.Editing;
  }

  cancelEditFolder(value: Folder) {
    if (value.status === FolderStatus.Creating) {
      this.folders = without(this.folders, value);
    } else {
      value.status = FolderStatus.Idle;
    }
  }

  validate = (value: string) => {
    const lowerCaseValue = value.toLowerCase();
    if (
      this.folders
        .filter((f) => !this.isEditing(f))
        .some((f) => f.name.toLowerCase() === lowerCaseValue)
    ) {
      return 'Please type unique name';
    }

    return true;
  };

  isDeleteEnabled = () => {
    return this.folders.length > 1;
  };

  applyEditFolder = (folder: Folder) => {
    const value = this.input?.validatedValue;

    if (value !== undefined) {
      if (folder.status === FolderStatus.Creating) {
        this._addFolder(value, folder);
      } else {
        this._patchFolder(value, folder);
      }
    }
  };

  onFolderClick = (folder: Folder) => {
    this._userInfoService.currentFolder.next(folder.name);
  };

  isIdle = (folder: Folder) => folder.status === FolderStatus.Idle;

  private _isInputValueValid = () => {
    if (this.input === undefined) return true;
    return this.input.validatedValue === this.input.value;
  };
}
