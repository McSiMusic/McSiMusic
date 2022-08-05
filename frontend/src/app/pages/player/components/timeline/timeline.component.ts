import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as _ from 'lodash';
import { clamp } from 'lodash';
import { Subscription } from 'rxjs';
import { PlayerService } from '../../../../services/PlayerService';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private _playerService: PlayerService, private _ngZone: NgZone) {
    this._subscriptions.push(
      this._playerService.currentSoundBufferProgressUpdated.subscribe(
        this._onTrackLoading
      )
    );

    this._subscriptions.push(
      this._playerService.onPlaying.subscribe(this._onPlaying)
    );
  }

  @ViewChild('timeline') timeline?: ElementRef<HTMLElement>;
  loadingProgress = 0;
  playingProgress = 0;
  private _handleCaptured = false;
  private _subscriptions: Subscription[] = [];

  ngAfterViewInit() {
    if (this.timeline === undefined) {
      return;
    }

    this._ngZone.runOutsideAngular(() => {
      this.timeline?.nativeElement.addEventListener(
        'mousedown',
        this._onMouseDown
      );
    });
  }

  private _onMouseDown = (event: MouseEvent) => {
    this._handleCaptured = true;

    this._ngZone.run(() => {
      this.playingProgress = this._getProcentPosition(event);
    });

    this._ngZone.runOutsideAngular(() => {
      document.addEventListener('mousemove', this._onMouseMove);
      document.addEventListener('mouseup', this._onMouseUp);
    });
  };

  private _onMouseMove = (event: MouseEvent) => {
    if (this._handleCaptured) {
      event.preventDefault();
      this._ngZone.run(() => {
        this.playingProgress = this._getProcentPosition(event);
      });
    }
  };

  private _onMouseUp = (event: MouseEvent) => {
    this._ngZone.run(() => {
      this.playingProgress = this._getProcentPosition(event);
      this._playerService.seek(this.playingProgress);
    });

    this._handleCaptured = false;

    this._ngZone.runOutsideAngular(() => {
      document.removeEventListener('mousemove', this._onMouseMove);
      document.removeEventListener('mouseup', this._onMouseUp);
    });
  };

  private _getProcentPosition = (event: MouseEvent) => {
    if (this.timeline === undefined) {
      return 0;
    }

    const rect = this.timeline.nativeElement.getBoundingClientRect();
    const progress = ((event.clientX - rect.left) / rect.width) * 100;

    console.log(progress);
    return clamp(progress, 0, 100);
  };

  ngOnDestroy(): void {
    this._subscriptions.forEach((s) => s.unsubscribe());

    document.removeEventListener('mousemove', this._onMouseMove);
    document.removeEventListener('mouseup', this._onMouseUp);

    if (this.timeline?.nativeElement === undefined) {
      return;
    }

    this.timeline?.nativeElement.removeEventListener(
      'mousedown',
      this._onMouseDown
    );
  }

  private _onTrackLoading = (progress: number) => {
    this.loadingProgress = progress;
  };

  private _onPlaying = (progress: number) => {
    if (this._handleCaptured) return;
    this.playingProgress = progress;
  };

  ngOnInit(): void {}
}
