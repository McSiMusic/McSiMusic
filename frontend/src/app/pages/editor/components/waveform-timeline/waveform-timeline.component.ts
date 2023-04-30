import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { clamp, uniq } from 'lodash';
import { combineLatest, filter, fromEvent, map, merge, mergeMap, scan, Subject, takeUntil, takeWhile, tap } from 'rxjs';
import { ActionsService } from 'src/app/services/ActionsService';
import { PlayerService } from 'src/app/services/PlayerService';
import { Track } from 'src/app/services/types';
import { UserInfoService } from 'src/app/services/UserInfoService';
import { sToTime } from 'src/app/utils/durtaionConvertor';
import { createImageFromBlob } from 'src/app/utils/imageUtils';
import { addToRange, getNormalizedRange, intersection, isInRange, Range } from 'src/app/utils/rangeUtils';

const PERCENT_CLICK_THRESHOLD = 2;
type PointerAction = "move" | "click" | "moved";
type Cursor = 'text' | 'auto' | 'grab' | 'grabbing';
type WaveformTimelineState = "idle" | "selection" | "selected" | "draggermoving" | "selectionmoving";
interface InternalPointerEvent { initial: number, current: number, action?: PointerAction }
const fullRange = { start: 0, end: 100 }

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

    this._subscribeToPointerEvents(this._createSelectionDraggersHandler('start'), element.nativeElement, false);
  }

  @ViewChild('endDragger', { read: ElementRef }) set endDragger(element: ElementRef<HTMLDivElement>) {
    if (element === undefined)
      return;

    this._subscribeToPointerEvents(this._createSelectionDraggersHandler('end'), element.nativeElement, false);
  }

  @ViewChild('waveFormContainer', { read: ElementRef }) waveFormContainer?: ElementRef<HTMLDivElement>;

  private _lastSelectionMove?: number;
  private _anchorDragger?: number;
  private _currentState: WaveformTimelineState = "idle";
  private _cursor: Cursor = 'auto';
  loading = false;
  waveform?: string;
  trackMeta?: Track;
  draggerPosition = 0;
  selection?: Range;
  destroySubject = new Subject();  

  private _setState = (state: WaveformTimelineState) => {
    this._currentState = state;
    if (state === 'idle')
       this._resetCursor();

    if (state === "draggermoving" || state === "selectionmoving") {
      this._setCursor("grabbing");
    }

    if (state === "selection")
      this._setCursor("text");
  }

  ngAfterViewInit() {
    if (this.dragger === undefined || this.waveFormContainer === undefined)
      return;

    this._subscribeToPointerEvents(({ current, action }) => {
      this._setState(action === 'moved' ? 'idle' : 'draggermoving')
      this._changeDraggerPosition(current);
    }, this.dragger.nativeElement, false);

    this._subscribeToPointerEvents(({ initial, current, action }) => {
      if (action !== "click") {
        if (this._isSelectionMoving(current)) {
          this._setState('selectionmoving');
          const diff = current - (this._lastSelectionMove || initial);
          this.selection = addToRange(this.selection!, diff, fullRange)
          this._lastSelectionMove = current;
          document.body.style.cursor = "grabbing";
        } else {
          this._setState("selection");
          this.selection = intersection({ start: initial, end: current }, fullRange) || undefined;
          document.body.style.cursor = "text";
        }

        if (action === "moved") {
          this._lastSelectionMove = undefined;
          this._setState("idle");
          document.body.style.cursor = "auto";
        }
      } else {
        this._changeDraggerPosition(current);
      }
    }, this.waveFormContainer.nativeElement);
  }

  private _createSelectionDraggersHandler = (draggerType: 'start' | 'end') => ({ current, action }: InternalPointerEvent) => {
    if (!this.selection)
      return;

    this._setState(action === 'moved' ? 'idle' : 'draggermoving')
    
    if (!this._anchorDragger) {
      const { start, end } = this.selection;
      this._anchorDragger = draggerType === 'start' ? end : start;
    }
    
    this.selection = getNormalizedRange({ start: clamp(current, 0, 100), end: this._anchorDragger! })
    if (action !== "move") {
      this._anchorDragger = undefined;
    }
  }

  private _changeDraggerPosition = (value: number) => {
    this._playerService.seek(value);
    this.draggerPosition = value;
  }

  private _isInsideSelection = (value: number) => {
    if (!this.selection)
      return false;
    return isInRange(clamp(value, 0, 100), this.selection, true)
  }

  get selectionMoving() { return this._currentState === 'selectionmoving' }

  private _isSelectionMoving = (value: number) => {
    if (this._currentState === 'selectionmoving')
      return true;

    if (!this.selection || this._currentState !== 'idle')
      return false;

    return this._isInsideSelection(value)
  }

  private _subscribeToPointerEvents = (
    callback: (value: InternalPointerEvent) => void, 
    element: HTMLElement,
    captureClickEvent = true,
  ) => {
    const pointerDown$ = fromEvent(element, 'pointerdown');
    const pointerMove$ = fromEvent(document, 'pointermove');
    const pointerUp$ = fromEvent(document, 'pointerup');

    pointerDown$.pipe(
      tap(e => { e.preventDefault(); e.stopPropagation(); }),
      mergeMap(pointerDownEvent => merge(pointerMove$, pointerUp$).pipe(
        takeWhile(e => e.type !== "pointerup", true),
        map(e => ({
          initial: this._getPercentFromPointerEvent(pointerDownEvent as PointerEvent),
          current: this._getPercentFromPointerEvent(e as PointerEvent),
          type: e.type
        })),
        tap(e => console.log(e)),
        scan<InternalPointerEvent & { type: string }, InternalPointerEvent, undefined>((acc: InternalPointerEvent | undefined, { initial, current, type }) => {
          console.log(type);
          let newAction: PointerAction | undefined = acc?.action;
          if (!captureClickEvent || newAction !== "move" && Math.abs(initial - current) > PERCENT_CLICK_THRESHOLD) {
            newAction = "move";
          }

          if (type === "pointerup") {
            newAction = newAction === undefined ? "click" : "moved";
          }

          return {
            initial: initial,
            current: current,
            action: newAction,
          }
        }, undefined),
        filter(v => v.action !== undefined))),
        takeUntil(this.destroySubject)
    ).subscribe(callback)
  }

  private _getPercentFromPointerEvent = (pointerEvent: MouseEvent) => {
    const waveFormContainerElement = this.waveFormContainer?.nativeElement;
    return waveFormContainerElement ?
      ((pointerEvent.clientX - waveFormContainerElement.offsetLeft) / waveFormContainerElement.offsetWidth) * 100
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

  private _resetCursor = () => {
    this._setCursor('auto');
  }

  get draggerCursor() {
    return this._isDefaultCursor() ? 'grab' : this._cursor;
  }

  get selectionCursor() {
    return this._isDefaultCursor() ? 'grab' : this._cursor;
  }

  private _isDefaultCursor = () => {
    return this._cursor === "auto"
  }

  private _setCursor = (value: Cursor) => {
    this._cursor = value;
    document.body.style.cursor = value;
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
