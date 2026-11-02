import { Directive, ElementRef, input } from '@angular/core';

@Directive({ selector: '[appAutofocus]', standalone: true })
export class AutofocusDirective {
  constructor(private _element: ElementRef) {}
  readonly appAutofocus = input(false);

  ngAfterViewInit() {
    if (this.appAutofocus()) this._element.nativeElement.focus();
  }
}
