import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appAutofocus]',
})
export class AutofocusDirective {
  constructor(private _element: ElementRef) {}
  @Input() appAutofocus = false;

  ngAfterViewInit() {
    if (this.appAutofocus) this._element.nativeElement.focus();
  }
}
