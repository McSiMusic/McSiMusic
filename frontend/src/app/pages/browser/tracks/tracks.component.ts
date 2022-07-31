import { Component, OnInit } from '@angular/core';
import { UserInfoService } from 'src/app/services/UserInfoService';
import {
  BehaviorSubject,
  combineLatest,
  scan,
  filter,
  switchMap,
  tap,
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
  ) {
    this.tracks$.subscribe(console.log);
  }

  private _page = new BehaviorSubject(0);
  private _filter = new BehaviorSubject('');
  private _sort = new BehaviorSubject(0);
  tableDescriptor = tableDescriptor;
  isLoading = false;

  private get _currentFolder() {
    return this._userInfoService.currentFolder;
  }

  tracks$ = combineLatest([this._currentFolder, this._filter]).pipe(
    filter((folder) => folder != null),
    switchMap(([folder, filter]) =>
      this._page.pipe(
        tap(() => (this.isLoading = true)),
        switchMap((page) =>
          this._userInfoService.getTracks(folder!, page, filter)
        ),
        scan((acc, tracks) => [...acc, ...tracks]),
        tap(() => (this.isLoading = false))
      )
    )
  );

  getConvertedValue = (value: any, descriptor: TrackPropDescriptor) => {
    return descriptor.convert ? descriptor.convert(value) : value;
  };

  onUpload = (files: FileList) => {
    this.isLoading = true;
    this._userInfoService
      .upload(files, this._currentFolder.value!)
      .subscribe((tracks) => {
        this._currentFolder.next(this._currentFolder.value);
        this.isLoading = false;
      });
  };

  loadNextPage() {
    this._page.next(this._page.value + 1);
  }

  ngOnInit(): void {}

  onFilterValueChanged = (val: string) => {
    this._filter.next(val);
  };
}
