import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { UserInfoService } from 'src/app/services/UserInfoService';
import { AudioVisualizer } from '../../../../services/AudioVisualizer';
import { ActionsService } from '../../../../services/ActionsService';
import { from, map, mergeMap } from 'rxjs';
import { createImageFromBlob } from 'src/app/utils/imageUtils';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-trim',
  templateUrl: './trim.component.html',
  styleUrls: ['./trim.component.scss'],
})
export class TrimComponent implements OnInit {
  constructor(
    private _userInfoService: UserInfoService,
    private _actionsService: ActionsService,
    private _visualizer: AudioVisualizer,
    private _sanitizer: DomSanitizer
  ) {}

  @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;
  @Input() trackId?: string;
  loading = false;
  waveform?: string;

  createAudioWaveForm = (audioBuffer: AudioBuffer) => {
    this.loading = true;
    this._actionsService
      .getWaveForm(this.trackId!)
      .pipe(mergeMap((blob) => from(createImageFromBlob(blob.body!))))
      .subscribe((result) => {
        this.waveform = this._sanitizer.bypassSecurityTrustResourceUrl(
          result as string
        ) as string;
        this.loading = false;
      });

    /* this.loading = true;
    this._visualizer.fillCanvas(audioBuffer, this.canvas.nativeElement);
    this.loading = false; */
  };

  ngOnInit(): void {
    if (this.trackId === undefined) return;
    this._userInfoService
      .getTrackAsArrayBuffer(this.trackId)
      .subscribe(async (res) => {
        const audioBuffer = await new AudioContext().decodeAudioData(res.body!);
        this.createAudioWaveForm(audioBuffer);
      });
  }
}
