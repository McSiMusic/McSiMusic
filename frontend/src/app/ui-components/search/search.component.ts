import { Component, OnInit, ChangeDetectionStrategy, input, output } from '@angular/core';
import { InputComponent } from '../input/input.component';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [InputComponent]
})
export class SearchComponent implements OnInit {
  readonly onChange = output<string>();
  readonly placeholder = input('');
  constructor() {}

  ngOnInit(): void {}
}
