import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-dropdown-icon',
    templateUrl: './dropdown-icon.component.html',
    styleUrls: ['./dropdown-icon.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class DropdownIconComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
