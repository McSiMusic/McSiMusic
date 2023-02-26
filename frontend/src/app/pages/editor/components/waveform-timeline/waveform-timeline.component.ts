import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { uniq } from 'lodash';
import { combineLatest, filter, fromEvent, map, merge, mergeMap, scan, Subject, takeUntil, takeWhile, tap } from 'rxjs';
import { ActionsService } from 'src/app/services/ActionsService';
import { PlayerService } from 'src/app/services/PlayerService';
import { Track } from 'src/app/services/types';
import { UserInfoService } from 'src/app/services/UserInfoService';
import { sToTime } from 'src/app/utils/durtaionConvertor';
import { createImageFromBlob } from 'src/app/utils/imageUtils';
import { Range } from 'src/app/utils/rangeUtils';

const PERCENT_CLICK_THRESHOLD = 3;
type PointerAction = "move" | "click";
interface InternalPointerEvent { initial: number, current: number, action?: PointerAction }

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
  @ViewChild('startDragger', { read: ElementRef }) set startDragger(element: ElementRef<HTMLDivElement>) {
    if (element === undefined)
      return;

    this._subscribeToPointerEvents(value => {
      if (this.selection !== undefined) {
        this.selection.start = value.current;
      }
    }, element.nativeElement);
  }

  @ViewChild('endDragger', { read: ElementRef }) set endDragger(element: ElementRef<HTMLDivElement>) {
    if (element === undefined)
      return;

    this._subscribeToPointerEvents(value => {
      if (this.selection !== undefined) {
        this.selection.end = value.current;
      }
    }, element.nativeElement);
  }

  @ViewChild('waveFormContainer', { read: ElementRef }) waveFormContainer?: ElementRef<HTMLDivElement>;

  loading = false;
  waveform?: string;
  trackMeta?: Track;
  draggerPosition = 0;
  selection?: Range;
  destroySubject = new Subject();

  ngAfterViewInit() {
    if (this.dragger === undefined || this.waveFormContainer === undefined)
      return;

    this._subscribeToPointerEvents(value => {
      this._playerService.seek(value.current);
      this.draggerPosition = value.current;
    }, this.dragger.nativeElement);

    this._subscribeToPointerEvents(({ initial, current, action }) => {
      this.selection = {
        start: initial,
        end: current
      }
    }, this.waveFormContainer.nativeElement);

    fromEvent(this.waveFormContainer.nativeElement, "click").pipe(
      map((e: Event) => this._getPercentFromPointerEvent(e as PointerEvent))
    ).subscribe(value => {
      if (!this.selection) {
        this.draggerPosition = value;
      }
    });
  }

  private _subscribeToPointerEvents = (
    callback: (value: InternalPointerEvent) => void, 
    element?: HTMLElement
  ) => {
    if (element === undefined)
      return;

    const pointerDown$ = fromEvent(element, 'pointerdown');
    const pointerMove$ = fromEvent(document, 'pointermove');
    const pointerUp$ = fromEvent(document, 'pointerup');

    pointerDown$.pipe(
      mergeMap(pointerDownEvent => merge(pointerMove$, pointerUp$).pipe(
        tap(e => e.preventDefault()),
        takeWhile(e => e.type !== "pointerup", true),
        map(e => ({
          initial: this._getPercentFromPointerEvent(pointerDownEvent as PointerEvent),
          current: this._getPercentFromPointerEvent(e as PointerEvent),
          type: e.type
        })),
        scan<InternalPointerEvent & { type: string }, InternalPointerEvent>((acc: InternalPointerEvent, { initial, current, type }) => {
          let newAction: PointerAction | undefined = acc.action;
          if (newAction !== "move" && Math.abs(initial - current) > PERCENT_CLICK_THRESHOLD) {
            newAction = "move";
          }

          if (type === "pointerup" && newAction === undefined) {
            newAction = "click";
          }
          
          return {
            initial: initial,
            current: current,
            action: newAction,
          }
        }),
        filter(v => v.action !== undefined))),
        takeUntil(this.destroySubject)
    ).subscribe(callback)
  }

  private _getPercentFromPointerEvent = (pointerEvent: MouseEvent) => {
    const waveFormContainerElement = this.waveFormContainer?.nativeElement;
    return waveFormContainerElement ?
      ((pointerEvent.clientX - waveFormContainerElement.clientLeft) / waveFormContainerElement.offsetWidth) * 100
      : 0;
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
    this.destroySubject.next(null);
    this.destroySubject.complete();
    this._playerService.onPlaying.unsubscribe()
  }
}
