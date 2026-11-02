import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-pause-icon',
    templateUrl: './pause-icon.component.html',
    styleUrls: ['./pause-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class PauseIconComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
