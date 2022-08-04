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
import { PlayerService } from '../../services/PlayerService';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit, AfterViewInit {
  constructor(
    private _userInfoService: UserInfoService,
    private _interSectionService: IntersectionService,
    private _playerService: PlayerService
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
      if (tracks.length <= TRACK_PAGE_SIZE) {
        this._playerService.setCurrentTrack(tracks[0]);
      }
      this.isLoading = false;
    });

    this.onFolderChange(this._userInfoService.folders![0]);
  }

  loadNextPage() {
    this._page.next(this._page.value + 1);
  }

  playOrPause = (track?: Track) => {
    const targetTrack = track || this._playerService.currentTrack;
    if (targetTrack === undefined) return;

    if (!this.isCurrentTrack(targetTrack)) {
      this._playerService.play(targetTrack);
    } else {
      if (this._playerService.isPlaying()) {
        this._playerService.pause(targetTrack);
      } else {
        this._playerService.resume(targetTrack);
      }
    }
  };

  isCurrentTrack = (track: Track) => {
    return this._playerService.isCurrentTrack(track);
  };

  isPlaying = () => {
    return this._playerService.isPlaying();
  };

  isCurrentTrackPlaying = (track: Track) => {
    return this._playerService.isCurrentTrackPlaying(track);
  };

  get currentTrackName() {
    return this._playerService.currentTrack?.name;
  }
}
