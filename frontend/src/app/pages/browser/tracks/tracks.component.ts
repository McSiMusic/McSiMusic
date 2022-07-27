import { Component, OnInit } from '@angular/core';
import { UserInfoService } from 'src/app/services/UserInfoService';
import {
  mergeMap,
  of,
  BehaviorSubject,
  merge,
  combineLatest,
  reduce,
  scan,
} from 'rxjs';
import { tableDescriptor, TrackPropDescriptor } from './consts';
import { IntersectionService } from 'src/app/services/IntersectionService';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss'],
})
export class TracksComponent implements OnInit {
  constructor(
    private _userInfoService: UserInfoService,
    private _interSectionService: IntersectionService
  ) {}

  private _page = new BehaviorSubject(0);
  tableDescriptor = tableDescriptor;
  isLoading = false;

  private get _currentFolder() {
    return this._userInfoService.currentFolder;
  }

  tracks$ = combineLatest([this._currentFolder, this._page]).pipe(
    mergeMap(([f, p]) => (f ? this._userInfoService.getTracks(f, p) : of([]))),
    scan((acc, tracks) => [...acc, ...tracks])
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

  loadNextPage() {
    this._page.next(this._page.value + 1);
  }

  ngOnInit(): void {}
}
