import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-sort-icon',
    templateUrl: './sort-icon.component.html',
    styleUrls: ['./sort-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class SortIconComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
