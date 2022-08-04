import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerService } from '../../../../services/PlayerService';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit, OnDestroy {
  constructor(private _playerService: PlayerService) {
    this._playerService.currentSoundBufferProgressUpdated.subscribe(
      this._onTrackLoading
    );

    this._playerService.onPlaying.subscribe(this._onPlaying);
  }

  loadingProgress = 0;
  playingProgress = 0;

  ngOnDestroy(): void {
    this._playerService.currentSoundBufferProgressUpdated.unsubscribe();
    this._playerService.onPlaying.unsubscribe();
  }

  private _onTrackLoading = (progress: number) => {
    console.log('LOADING: ' + progress);
    this.loadingProgress = progress;
  };
  private _onPlaying = (progress: number) => {
    console.log('PLAYING: ' + progress);
    this.playingProgress = progress;
  };

  ngOnInit(): void {}
}
