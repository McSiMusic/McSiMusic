import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfoService } from '../../services/UserInfoService';
import { map, Subject, mergeMap, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
})
export class BrowserComponent implements OnInit {
  constructor(private _userInfoService: UserInfoService) {}

  foldersLoading = false;
  tracksLoading = true;
  currentFolder = new BehaviorSubject<string>(this.folders![0]);

  tracks$ = this.currentFolder.pipe(
    mergeMap((f) => this._userInfoService.getTracks(f))
  );

  get folders() {
    return this._userInfoService.folders;
  }

  isCurrentFolder = (folder: string) => {
    return this.currentFolder.value === folder;
  };

  setCurrentFolder(folder: string) {
    this.currentFolder.next(folder);
  }

  onUpload = (files: FileList) => {
    this._userInfoService
      .upload(files, this.currentFolder.value)
      .subscribe((tracks) => {
        this.currentFolder.next(this.currentFolder.value);
      });
  };

  ngOnInit(): void {}
}
