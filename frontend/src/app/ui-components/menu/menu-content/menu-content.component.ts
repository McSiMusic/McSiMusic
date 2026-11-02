import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  ChangeDetectionStrategy,
  input,
  viewChild,
  output
} from '@angular/core';
import { MenuItem } from '../types';
import { dropdownTopMargin } from './consts';

import { NgClass } from '@angular/common';

@Component({
    selector: 'app-menu-content',
    templateUrl: './menu-content.component.html',
    styleUrls: ['./menu-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [NgClass]
})
export class MenuContentComponent implements AfterViewChecked {
  readonly elements = input<MenuItem[]>([]);
  readonly hostElement = input<ElementRef<HTMLElement> | null>(null);
  readonly selectedIndex = input<number>();
  readonly content = viewChild<ElementRef<HTMLElement>>('content');
  readonly onOutsideClick = output();

  @HostListener('document:click', ['$event.target'])
  onPublicClick = (targetElement: HTMLElement) => {
    const clickedInside =
      this.content()?.nativeElement.contains(targetElement) ||
      this.hostElement()?.nativeElement.contains(targetElement);

    if (!clickedInside) {
      this.onOutsideClick.emit();
    }
  };

  constructor(private _cdRef: ChangeDetectorRef) {}

  left = '0';
  top = '0';

  ngAfterViewChecked() {
    this._changePosition();
  }

  private _changePosition() {
    const hostElement = this.hostElement();
    const content = this.content();
    if (hostElement === null || content === undefined) return;

    const clientRect = hostElement.nativeElement.getBoundingClientRect();
    const contentRect = content.nativeElement.getBoundingClientRect();

    this.left = `${
      clientRect.left + clientRect.width / 2 - contentRect.width / 2
    }px`;
    this.top = `${clientRect.bottom + dropdownTopMargin}px`;

    this._cdRef.detectChanges();
  }
}
