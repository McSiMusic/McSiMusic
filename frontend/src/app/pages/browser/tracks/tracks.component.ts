import { Component, OnInit } from '@angular/core';
import { UserInfoService } from 'src/app/services/UserInfoService';
import { mergeMap, of } from 'rxjs';
import { tableDescriptor, TrackPropDescriptor } from './consts';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss'],
})
export class TracksComponent implements OnInit {
  constructor(private _userInfoService: UserInfoService) {}

  tableDescriptor = tableDescriptor;
  isLoading = false;

  private get _currentFolder() {
    return this._userInfoService.currentFolder;
  }

  tracks$ = this._currentFolder.pipe(
    mergeMap((f) => (f ? this._userInfoService.getTracks(f) : of([])))
  );

  getConvertedValue = (value: any, descriptor: TrackPropDescriptor) => {
    return descriptor.convert ? descriptor.convert(value) : value;
  };

  onUpload = (files: FileList) => {
    this.isLoading = false;
    this._userInfoService
      .upload(files, this._currentFolder.value!)
      .subscribe((tracks) => {
        this._currentFolder.next(this._currentFolder.value);
      });

    this.isLoading = true;
  };
  ngOnInit(): void {}
}
