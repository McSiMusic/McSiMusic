import { Component, OnInit, ChangeDetectionStrategy, input, viewChild } from '@angular/core';
import { without } from 'lodash';
import { UserInfoService } from 'src/app/services/UserInfoService';
import { Folder, FolderStatus } from './types';
import { BlurEvent } from '../../../ui-components/input/types';
import { PreloaderComponent } from '../../../components/preloader/preloader.component';
import { NgClass } from '@angular/common';
import { DeleteIconComponent } from '../../../icons/delete-icon/delete-icon.component';
import { ClickStopPropagationDirective } from '../../../directives/click-stop-propagation.directive';
import { EditIconComponent } from '../../../icons/edit-icon/edit-icon.component';
import { InputComponent } from '../../../ui-components/input/input.component';
import { ApplyIconComponent } from '../../../icons/apply-icon/apply-icon.component';

@Component({
    selector: 'app-folders',
    templateUrl: './folders.component.html',
    styleUrls: ['./folders.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [PreloaderComponent, NgClass, DeleteIconComponent, ClickStopPropagationDirective, EditIconComponent, InputComponent, ApplyIconComponent]
})
export class FoldersComponent {
  constructor(private _userInfoService: UserInfoService) {
    this.folders = (this._userInfoService.folders ?? []).map((name) => ({
      name,
      status: FolderStatus.Idle,
    }));
  }
  foldersLoading = false;
  folders: Folder[] = [];

  readonly actionEnabled = input(true);
  readonly input = viewChild(InputComponent);

  private get _currentFolder() {
    return this._userInfoService.currentFolder();
  }

  isCurrentFolder = (folder: Folder) => {
    return (
      this._currentFolder === folder.name && folder.status === FolderStatus.Idle
    );
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
      this._userInfoService.setCurrentFolder(folder.name);
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
      if (this._userInfoService.currentFolder() === oldValue) {
        this._userInfoService.setCurrentFolder(folder.name);
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
        this._userInfoService.setCurrentFolder(newCurrentFolder?.name ?? null);
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
    const value = this.input()?.validatedValue;

    if (value !== undefined) {
      if (folder.status === FolderStatus.Creating) {
        this._addFolder(value, folder);
      } else {
        this._patchFolder(value, folder);
      }
    }
  };

  onFolderClick = (folder: Folder) => {
    if (folder.status === FolderStatus.Idle) {
      this._userInfoService.setCurrentFolder(folder.name);
      this.folders = this.folders.filter(
        (f) => f.status !== FolderStatus.Creating
      );
      this.folders.forEach((f) => {
        if (f.status === FolderStatus.Editing) f.status = FolderStatus.Idle;
      });
    }
  };

  isIdle = (folder: Folder) => folder.status === FolderStatus.Idle;

  private _isInputValueValid = () => {
    const inputValue = this.input();
    if (inputValue === undefined) return true;
    return inputValue.errorMessage === null;
  };
}
