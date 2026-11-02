import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ChangeDetectionStrategy,
  input,
  output,
  viewChild
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
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
import { SortOrder, DndState } from './types';
import { TRACK_PAGE_SIZE } from 'src/app/services/consts';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { SearchComponent } from '../../../ui-components/search/search.component';
import { NgClass, AsyncPipe } from '@angular/common';
import { SortIconComponent } from '../../../icons/sort-icon/sort-icon.component';
import { ClickStopPropagationDirective } from '../../../directives/click-stop-propagation.directive';
import { DownloadButtonComponent } from '../../../icons/download-icon/download-icon.component';
import { DeleteIconComponent } from '../../../icons/delete-icon/delete-icon.component';
import { UploadComponent } from '../../../ui-components/upload/upload.component';
import { PreloaderLogoComponent } from '../../../components/preloader/components/preloader-logo/preloader-logo.component';
import { PreloaderComponent } from '../../../components/preloader/preloader.component';
import { ButtonComponent } from '../../../ui-components/button/button.component';

@Component({
    selector: 'app-tracks',
    templateUrl: './tracks.component.html',
    styleUrls: ['./tracks.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [SearchComponent, NgClass, SortIconComponent, ClickStopPropagationDirective, DownloadButtonComponent, DeleteIconComponent, UploadComponent, PreloaderLogoComponent, PreloaderComponent, ButtonComponent, AsyncPipe]
})
export class TracksComponent implements AfterViewInit, OnInit {
  private readonly _currentFolder: Observable<string | null>;

  constructor(
    private _userInfoService: UserInfoService,
    private _interSectionService: IntersectionService
  ) {
    this._currentFolder = toObservable(this._userInfoService.currentFolder);
  }

  ngAfterViewInit(): void {
    const pageLoadingAnchor = this.pageLoadingAnchor();
    if (pageLoadingAnchor === undefined) return;
    this._interSectionService
      .createAndObserve(pageLoadingAnchor)
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
      this._refreshTracks,
    ]).pipe(
      filter(
        (values): values is [string, string, keyof Track, SortOrder, void] =>
          values[0] !== null
      ),
      tap((args) => {
        this._page.complete();
        this._page = new BehaviorSubject(0);
        this.isLoading = true;
        this.selectTrack();
      }),
      switchMap(([folder, filter, sort, order]) =>
        this._page.pipe(
          tap(() => {
            this.isPageLoading = true;
          }),
          concatMap((page) => {
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
            this.isPageLoading = false;
          })
        )
      ),
      shareReplay()
    );

    this.tracks$.subscribe((tracks) => {
      this.isLoading = false;
      this.isEmpty = tracks.length === 0;
    });
  }

  readonly onDoubleClick = output<Track>();
  readonly pageLoadingAnchor = viewChild<ElementRef<HTMLElement>>('pageLoadingAnchor');
  readonly actionEnabled = input(true);
  readonly selectionChanged = output<Track | undefined>();

  private _page = new BehaviorSubject(0);
  private _refreshTracks = new BehaviorSubject<void>(undefined);
  private _filter = new BehaviorSubject('');
  private _sort = new BehaviorSubject<keyof Track>('name');
  private _sortOrder = new BehaviorSubject<SortOrder>(SortOrder.Asc);
  tableDescriptor = tableDescriptor;
  isLoading = true;
  isPageLoading = false;
  tracks$?: Observable<Track[]>;
  preloaderProgress = '';
  uploadError = '';
  currentTrack?: Track;
  isEmpty = false;
  dndState: DndState = DndState.Idle;

  getConvertedValue = (value: any, descriptor: TrackPropDescriptor) => {
    return descriptor.convert ? descriptor.convert(value) : value;
  };

  onUpload = (files: FileList | File[]) => {
    const folder = this._userInfoService.currentFolder();
    if (folder === null) return;
    this.isLoading = true;
    this.uploadError = '';
    this.dndState = DndState.Idle;

    this._userInfoService
      .upload(files, folder)
      .subscribe({
        next: (event: HttpEvent<Track[]>) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.preloaderProgress = `Uploading ${Math.round(
              (event.loaded / (event.total || event.loaded)) * 100
            )} %`;

            if (event.total !== undefined && event.loaded === event.total) {
              this.preloaderProgress = 'Processing...';
            }
          } else if (event.type === HttpEventType.Response) {
            this._refreshTracks.next();
            this.preloaderProgress = '';
            this.isLoading = false;
            this.isEmpty = false;
          }
        },
        error: (error: HttpErrorResponse) => {
          this.preloaderProgress = '';
          this.isLoading = false;
          this.uploadError =
            error.error?.message || 'Upload failed. Please try again.';
        },
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
      this._refreshTracks.next();
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
    this.selectionChanged.emit(this.currentTrack);
  };

  isTrackSelected = (track?: Track) => {
    return this.currentTrack?._id === track?._id;
  };

  onTrackDoubleClick = (track?: Track) => {
    if (track === undefined) return;
    this.onDoubleClick.emit(track);
  };

  onDndLeave = () => {
    this.dndState = DndState.Idle;
  };

  onDndEnter = () => {
    this.dndState = DndState.Hover;
  };

  onMainDragEnter = () => {
    if (!this.isEmpty) {
      this.dndState = DndState.Hover;
    }
  };

  onMainDragOver = (event: DragEvent) => event.preventDefault();
  onMainDrop = (event: DragEvent) => event.preventDefault();
}
