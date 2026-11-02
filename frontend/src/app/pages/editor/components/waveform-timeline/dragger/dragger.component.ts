import { Component, OnInit, ChangeDetectionStrategy, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-dragger',
    templateUrl: './dragger.component.html',
    styleUrls: ['./dragger.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgClass]
})
export class DraggerComponent implements OnInit {
  readonly isPrimary = input(false);

  constructor() { }

  ngOnInit(): void {
  }

}
