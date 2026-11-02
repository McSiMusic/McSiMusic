import { Component, ElementRef, OnInit, ChangeDetectionStrategy, input, viewChild } from '@angular/core';
import { WaveformTimelineComponent } from '../waveform-timeline/waveform-timeline.component';

@Component({
    selector: 'app-trim',
    templateUrl: './trim.component.html',
    styleUrls: ['./trim.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [WaveformTimelineComponent]
})
export class TrimComponent implements OnInit {
  constructor() {}

  readonly canvas = viewChild<ElementRef<HTMLCanvasElement>>('canvas');
  readonly trackId = input<string>();
  
  ngOnInit(): void {

  }
}
