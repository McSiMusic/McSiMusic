import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DropdownItem } from 'src/app/ui-components/dropdown/types';
import { UserInfoService } from '../../services/UserInfoService';
import {
  BehaviorSubject,
  filter,
  tap,
  switchMap,
  concatMap,
  finalize,
  scan,
  shareReplay,
  takeWhile,
} from 'rxjs';
import { TRACK_PAGE_SIZE } from 'src/app/services/consts';
import { Track } from 'src/app/services/types';
import { Observable } from 'rxjs';
import { sToTime } from '../../utils/durtaionConvertor';
import { IntersectionService } from 'src/app/services/IntersectionService';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, AfterViewInit {
  constructor(
    private _userInfoService: UserInfoService,
    private _interSectionService: IntersectionService
  ) {
    this.folderDropdownItems =
      this._userInfoService.folders?.map((f) => ({
        name: f,
        value: f,
      })) || [];
  }

  ngAfterViewInit(): void {
    if (this.pageLoadingAnchor === undefined) return;
    this._interSectionService
      .createAndObserve(this.pageLoadingAnchor)
      .subscribe((value) => {
        if (!this.isLoading && value) this.loadNextPage();
      });
  }

  isLoading = true;
  isPageLoading = false;
  private _currentFolder = new BehaviorSubject<string | undefined>(undefined);
  private _page = new BehaviorSubject(0);
  tracks$?: Observable<Track[]>;
  @ViewChild('pageLoadingAnchor') pageLoadingAnchor?: ElementRef<HTMLElement>;
  folderDropdownItems: DropdownItem[] = [];

  onFolderChange = (value: string) => {
    this._currentFolder.next(value);
  };

  trackBy = (i: number, track: Track) => {
    return track._id;
  };

  convertDuration = (value: number) => {
    return sToTime(value);
  };

  ngOnInit(): void {
    this.tracks$ = this._currentFolder.pipe(
      filter((f) => f !== undefined),
      tap((args) => {
        this._page.complete();
        this._page = new BehaviorSubject(0);
        this.isLoading = true;
      }),
      switchMap((folder) =>
        this._page.pipe(
          tap(() => {
            this.isPageLoading = true;
          }),
          concatMap((page) => {
            return this._userInfoService.getTracks(folder!, page);
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
    });

    this.onFolderChange(this._userInfoService.folders![0]);
  }

  loadNextPage() {
    this._page.next(this._page.value + 1);
  }
}
