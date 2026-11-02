import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-download-icon',
    templateUrl: './download-icon.component.html',
    styleUrls: ['./download-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class DownloadButtonComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
