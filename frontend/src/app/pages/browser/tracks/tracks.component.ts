import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserInfoService } from 'src/app/services/UserInfoService';
import {
  BehaviorSubject,
  combineLatest,
  scan,
  filter,
  switchMap,
  tap,
  finalize,
  concatMap,
  shareReplay,
} from 'rxjs';
import { tableDescriptor, TrackPropDescriptor } from './consts';
import { IntersectionService } from 'src/app/services/IntersectionService';
import { takeWhile, Observable } from 'rxjs';
import { Track } from 'src/app/services/types';
import { SortOrder } from './types';
import { TRACK_PAGE_SIZE } from 'src/app/services/consts';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-tracks',
  templateUrl: './tracks.component.html',
  styleUrls: ['./tracks.component.scss'],
})
export class TracksComponent implements AfterViewInit, OnInit {
  constructor(
    private _userInfoService: UserInfoService,
    private _interSectionService: IntersectionService
  ) {}

  ngAfterViewInit(): void {
    if (this.pageLoadingAnchor === undefined) return;
    this._interSectionService
      .createAndObserve(this.pageLoadingAnchor)
      .subscribe((value) => {
        if (!this.isLoading && value) this.loadNextPage();
      });
  }

  ngOnInit(): void {
    this.tracks$ = combineLatest([
      this._currentFolder,
      this._filter,
      this._sort,
      this._sortOrder,
    ]).pipe(
      filter((folder) => folder != null),
      tap((args) => {
        this._page.complete();
        this._page = new BehaviorSubject(0);
        this.isLoading = true;
        console.log('Turn on main loader');
      }),
      switchMap(([folder, filter, sort, order]) =>
        this._page.pipe(
          tap(() => {
            this.isPageLoading = true;
            console.log('Turn on page loader');
          }),
          concatMap((page) => {
            console.log(`Get page ${page}`);
            return this._userInfoService.getTracks(
              folder!,
              page,
              filter,
              sort,
              order
            );
          }),
          takeWhile((tracks) => tracks.length === TRACK_PAGE_SIZE, true),
          scan((acc, tracks) => [...acc, ...tracks]),
          finalize(() => {
            console.log(`Finalize paging`);
            this.isPageLoading = false;
          })
        )
      ),
      shareReplay()
    );

    this.tracks$.subscribe((tracks) => {
      console.log(`Turn off main loader`);
      this.isLoading = false;
    });
  }

  @ViewChild('pageLoadingAnchor') pageLoadingAnchor?: ElementRef<HTMLElement>;

  private _page = new BehaviorSubject(0);
  private _filter = new BehaviorSubject('');
  private _sort = new BehaviorSubject<keyof Track>('name');
  private _sortOrder = new BehaviorSubject<SortOrder>(SortOrder.Asc);
  tableDescriptor = tableDescriptor;
  isLoading = true;
  isPageLoading = false;
  tracks$?: Observable<Track[]>;
  preloaderProgress = '';
  currentTrack?: Track;

  private get _currentFolder() {
    return this._userInfoService.currentFolder;
  }

  getConvertedValue = (value: any, descriptor: TrackPropDescriptor) => {
    return descriptor.convert ? descriptor.convert(value) : value;
  };

  onUpload = (files: FileList) => {
    this.isLoading = true;
    this._userInfoService
      .upload(files, this._currentFolder.value!)
      .subscribe((event: HttpEvent<Track[]>) => {
        console.log(event);
        if (event.type === HttpEventType.UploadProgress) {
          this.preloaderProgress = `Uploading ${Math.round(
            (event.loaded / event.total!) * 100
          )} %`;

          if (event.loaded === event.total) {
            this.preloaderProgress = 'Processing...';
          }
        } else if (event.type === HttpEventType.Response) {
          this._currentFolder.next(this._currentFolder.value);
          this.preloaderProgress = '';
          this.isLoading = false;
        }
      });
  };

  loadNextPage() {
    this._page.next(this._page.value + 1);
  }

  onFilterValueChanged = (val: string) => {
    this._filter.next(val);
  };

  isActiveSort = (sort: keyof Track) => {
    return sort === this._sort.value;
  };

  isAsc = () => this._sortOrder.value === SortOrder.Asc;

  onSortClick = (sort: keyof Track) => {
    if (this.isActiveSort(sort)) {
      this._sortOrder.next(this.isAsc() ? SortOrder.Desc : SortOrder.Asc);
    } else {
      this._sort.next(sort);
      this._sortOrder.next(SortOrder.Asc);
    }
  };

  trackBy = (i: number, track: Track) => {
    return track._id;
  };

  deleteTrack = (track?: Track) => {
    const targetTrack = track || this.currentTrack;
    if (targetTrack === undefined) return;

    this._userInfoService.deleteTrack(targetTrack).subscribe(() => {
      this._currentFolder.next(this._currentFolder.value);
      if (this.isTrackSelected(track)) {
        this.selectTrack();
      }
    });
  };

  downloadTrack = (track?: Track) => {
    const targetTrack = track || this.currentTrack;
    if (targetTrack === undefined) return;
    this._userInfoService.downloadTrack(targetTrack);
  };

  selectTrack = (track?: Track) => {
    this.currentTrack = this.isTrackSelected(track) ? undefined : track;
  };

  isTrackSelected = (track?: Track) => {
    return this.currentTrack?._id === track?._id;
  };
}
