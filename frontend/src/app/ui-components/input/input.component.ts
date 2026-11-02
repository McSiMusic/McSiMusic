import {
  Component,
  ElementRef,
  OnInit,
  ChangeDetectionStrategy,
  input,
  output,
  viewChild
} from '@angular/core';
import { BlurEvent, InputValidator } from './types';
import { debounce } from 'lodash';
import { Key } from 'ts-key-enum';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { AutofocusDirective } from '../../directives/autofocus.directive';

@Component({
    selector: 'app-input',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FormsModule, NgClass, AutofocusDirective]
})
export class InputComponent implements OnInit {
  readonly autoFocus = input(false);
  readonly bordered = input(true);
  readonly debounceTime = input(0);
  readonly validator = input<InputValidator>((value: string) => true);
  readonly initialValue = input('');
  readonly placeholder = input('');
  readonly onValidatedChange = output<string>();
  readonly onBlur = output<BlurEvent>();
  readonly input = viewChild<ElementRef<HTMLInputElement>>('input');

  private _onValidatedChange: (val: string) => void = () => {};

  errorMessage: string | null = null;

  validatedValue: string = '';
  value: string = '';

  constructor() {}

  ngOnInit(): void {
    const onValidatedValueChange = (val: string) =>
      this.onValidatedChange.emit(val);

    const debounceTime = this.debounceTime();
    this._onValidatedChange = debounceTime
      ? debounce(onValidatedValueChange, debounceTime)
      : onValidatedValueChange;

    this.value = this.initialValue();
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
    const validateResult = this.validator()(this.value);
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
      this.input()?.nativeElement.blur();
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
