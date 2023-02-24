import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { uniq } from 'lodash';
import { combineLatest, filter, from, fromEvent, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs';
import { ActionsService } from 'src/app/services/ActionsService';
import { PlayerService } from 'src/app/services/PlayerService';
import { Track } from 'src/app/services/types';
import { UserInfoService } from 'src/app/services/UserInfoService';
import { sToTime } from 'src/app/utils/durtaionConvertor';
import { createImageFromBlob } from 'src/app/utils/imageUtils';
import { isInRange, Range } from 'src/app/utils/rangeUtils';

@Component({
  selector: 'app-waveform-timeline',
  templateUrl: './waveform-timeline.component.html',
  styleUrls: ['./waveform-timeline.component.scss']
})
export class WaveformTimelineComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private _userInfoService: UserInfoService,
    private _playerService: PlayerService,
    private _actionsService: ActionsService,
    private _sanitizer: DomSanitizer) {
    this._playerService.onPlaying.subscribe(this._onPlaying)
  }

  @Input() trackId?: string;
  @ViewChild('dragger', { read: ElementRef }) dragger?: ElementRef<HTMLDivElement>;
  @ViewChild('startDragger', { read: ElementRef }) startDragger?: ElementRef<HTMLDivElement>;
  @ViewChild('endDragger', { read: ElementRef }) endDragger?: ElementRef<HTMLDivElement>;
  @ViewChild('waveFormContainer', { read: ElementRef }) waveFormContainer?: ElementRef<HTMLDivElement>;

  loading = false;
  waveform?: string;
  trackMeta?: Track;
  draggerPosition = 0;
  selection?: Range = { start: 20, end: 80 };

  ngAfterViewInit() {
    if (this.startDragger === undefined || this.dragger === undefined || this.endDragger === undefined)
      return;

    this._subscribeToPointerEvents(value => { 
      if (this.selection !== undefined) {
        this.selection.start = value;
      }
    }, this.startDragger.nativeElement);

    this._subscribeToPointerEvents(value => { 
      if (this.selection !== undefined) {
        this.selection.end = value;
      }
    }, this.endDragger.nativeElement);

    this._subscribeToPointerEvents(value => { 
      this._playerService.seek(value);
      this.draggerPosition = value;
    }, this.dragger.nativeElement);
  }

  private _subscribeToPointerEvents = (callback: (value: number) => void, element?: HTMLElement) => {
    if (element === undefined)
      return;

    const pointerDown$ = fromEvent(element, 'pointerdown');
    const pointerMove$ = fromEvent(document, 'pointermove');
    const pointerUp$ = fromEvent(document, 'pointerup');

    pointerDown$.pipe(
      tap(e => e.preventDefault()),
      map(e => e.target),
      filter(Boolean),
      mergeMap(_ => pointerMove$.pipe(
        map((e: Event) => {
          const pointerEvent = e as PointerEvent;
          const waveFormContainerElement = this.waveFormContainer?.nativeElement;
          return waveFormContainerElement ?
            ((pointerEvent.clientX - waveFormContainerElement.clientLeft) / waveFormContainerElement.offsetWidth) * 100
            : 0;
        }),
        takeUntil(pointerUp$)))

    ).subscribe(callback)
  }

  get leftDuration() {
    return sToTime(0);
  }

  get rightDuration() {
    return sToTime(this.trackMeta?.duration || 0);
  }

  get zoomPercent() {
    return 100;
  }

  isPlaying = () => {
    return this.trackId && this._playerService.isCurrentTrack(this.trackId) && this._playerService.isPlaying()
  }

  playOrPause = () => {
    if (this.trackMeta === undefined)
      return;

    if (!this._playerService.isCurrentTrack(this.trackMeta)) {
      this._playerService.play(this.trackMeta);
    } else {
      if (this._playerService.isPlaying()) {
        this._playerService.pause(this.trackMeta);
      } else {
        this._playerService.resume(this.trackMeta);
      }
    }
  }

  createAudioWaveForm = () => {
    if (this.trackId === undefined)
      return;
    this.loading = true;
    combineLatest([
      this._actionsService.getWaveForm(this.trackId).pipe(mergeMap((wv) => createImageFromBlob(wv.body!))),
      this._userInfoService.getTrackMeta(this.trackId)]
    ).subscribe(([waveworm, meta]) => {
      this.trackMeta = meta;
      this.waveform = this._sanitizer.bypassSecurityTrustResourceUrl(waveworm) as string;
      this.loading = false;
    });
  };

  private _getAnchors = () => {
    const anchors = [0];

    if (this.selection) {
      const { start, end } = this.selection
      anchors.push(Math.min(start, end), Math.max(start, end))
    }
    anchors.push(100);


    return uniq(anchors);
  }

  rewindBack = () => {
    const seek = this._getAnchors().find(anchor => anchor > this.draggerPosition) || 0;
    this._playerService.seek(seek)
  }

  rewindForward = () => {
    const seek = this._getAnchors().reverse().find(anchor => anchor < this.draggerPosition) || 0;
    this._playerService.seek(seek)
  }

  ngOnInit(): void {
    this.createAudioWaveForm();
  }

  private _onPlaying = (position: number) => {
    if (this.trackMeta === undefined)
      return;

    this.draggerPosition = position;
  }

  ngOnDestroy(): void {
    this._playerService.onPlaying.unsubscribe()
  }
}
