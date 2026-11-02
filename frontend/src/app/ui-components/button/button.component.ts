import { Component, OnInit, ChangeDetectionStrategy, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgClass]
})
export class ButtonComponent implements OnInit {
  readonly disabled = input(false);
  readonly bordered = input(true);

  constructor() {}

  ngOnInit(): void {}
}
