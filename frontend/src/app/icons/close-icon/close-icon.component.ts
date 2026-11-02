import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-close-icon',
    templateUrl: './close-icon.component.html',
    styleUrls: ['./close-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class CloseIconComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
