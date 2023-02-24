import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-trim',
  templateUrl: './trim.component.html',
  styleUrls: ['./trim.component.scss'],
})
export class TrimComponent implements OnInit {
  constructor() {}

  @ViewChild('canvas') canvas?: ElementRef<HTMLCanvasElement>;
  @Input() trackId?: string;
  
  ngOnInit(): void {

  }
}
