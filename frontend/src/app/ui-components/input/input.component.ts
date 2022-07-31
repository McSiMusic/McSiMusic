import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { InputValidator } from './types';
import { debounce } from 'lodash';
import { Key } from 'ts-key-enum';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Input() autoFocus = false;
  @Input() bordered = true;
  @Input() debounceTime = 0;
  @Input() validator: InputValidator = (value: string) => true;
  @Input() initialValue = '';
  @Input() placeholder = '';
  @Output() onValidatedChange = new EventEmitter<string>();
  @Output() onBlur = new EventEmitter<string>();
  @ViewChild('input') input?: ElementRef<HTMLInputElement>;

  private _onValidatedChange: (val: string) => void = () => {};

  errorMessage: string | null = null;

  validatedValue: string = '';
  value: string = '';

  constructor() {}

  ngOnInit(): void {
    const onValidatedValueChange = (val: string) =>
      this.onValidatedChange.emit(val);

    this._onValidatedChange = this.debounceTime
      ? debounce(onValidatedValueChange, this.debounceTime)
      : onValidatedValueChange;

    this.value = this.initialValue;
  }

  onInputBlur = () => {
    this._reset();
    this.onBlur.emit(this.validatedValue);
  };

  private _reset = () => {
    this.value = this.validatedValue;
    this._resetError();
  };

  onChange = (value: string) => {
    const validateResult = this.validator(value);
    if (validateResult === true) {
      this.validatedValue = value;
      this._onValidatedChange(value);
      this._resetError();
    } else {
      if (typeof validateResult === 'string') {
        this.errorMessage = validateResult;
      }
    }
  };

  onKeyUp = (event: KeyboardEvent) => {
    if (event.key === Key.Enter || event.key === Key.Escape) {
      this._reset();
      this.input?.nativeElement.blur();
      this.onBlur.emit(this.validatedValue);
    }
  };

  private _resetError = () => {
    this.errorMessage = null;
  };
}
