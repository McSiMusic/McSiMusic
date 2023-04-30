import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appPointerDownStopPropagation]'
})
export class PointerDownStopPropagationDirective {
  @HostListener('pointerdown', ['$event'])
  public onClick(event: PointerEvent): void {
    event.stopPropagation();
  }
}
