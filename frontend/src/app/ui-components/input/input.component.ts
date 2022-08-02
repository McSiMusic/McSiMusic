import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BlurEvent, InputValidator } from './types';
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
  @Output() onBlur = new EventEmitter<BlurEvent>();
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
    this.validatedValue = this.value;
    this._validate();
  }

  onInputBlur = () => {
    this._reset();
    this.onBlur.emit({ value: this.validatedValue });
  };

  private _reset = () => {
    //this.value = this.validatedValue;
    //this._resetError();
  };

  private _validate = () => {
    const validateResult = this.validator(this.value);
    if (validateResult === true) {
      this.validatedValue = this.value;
      this._resetError();
    } else {
      if (typeof validateResult === 'string') {
        this.errorMessage = validateResult;
      }
    }

    return this.errorMessage === null;
  };

  onChange = (value: string) => {
    if (this._validate()) this._onValidatedChange(value);
  };

  onKeyUp = (event: KeyboardEvent) => {
    if (event.key === Key.Enter || event.key === Key.Escape) {
      this._reset();
      this.input?.nativeElement.blur();
      this.onBlur.emit({
        value: this.validatedValue,
        isEsc: event.key === Key.Escape,
        isEnter: event.key === Key.Enter,
      });
    }
  };

  private _resetError = () => {
    this.errorMessage = null;
  };
}
