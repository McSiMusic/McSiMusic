import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { combineLatest, from, map, mergeMap } from 'rxjs';
import { ActionsService } from 'src/app/services/ActionsService';
import { Track } from 'src/app/services/types';
import { UserInfoService } from 'src/app/services/UserInfoService';
import { sToTime } from 'src/app/utils/durtaionConvertor';
import { createImageFromBlob } from 'src/app/utils/imageUtils';

@Component({
  selector: 'app-waveform-timeline',
  templateUrl: './waveform-timeline.component.html',
  styleUrls: ['./waveform-timeline.component.scss']
})
export class WaveformTimelineComponent implements OnInit {

  constructor( private _userInfoService: UserInfoService,
    private _actionsService: ActionsService,
    private _sanitizer: DomSanitizer) { }

  @Input() trackId?: string;
  loading = false;
  waveform?: string;
  trackMeta?: Track;
  draggerPosition = 0;

  get leftDuration() {
    return sToTime(0);
  }

  get rightDuration() {
    return sToTime(this.trackMeta?.duration || 0);
  }

  get zoomPercent() {
    return 100;
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

  ngOnInit(): void {
    this.createAudioWaveForm();
  }
}
