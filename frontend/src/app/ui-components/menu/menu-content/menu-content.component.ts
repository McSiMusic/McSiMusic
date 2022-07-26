import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MenuItem } from '../types';
import { dropdownTopMargin } from './consts';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.scss'],
})
export class MenuContentComponent implements OnInit, AfterViewChecked {
  @Input() elements: MenuItem[] = [];
  @Input() hostElement: ElementRef<HTMLElement> | null = null;
  @Input() selectedIndex?: number;
  @ViewChild('content') content: ElementRef<HTMLElement> | null = null;
  @Output() onOutsideClick = new EventEmitter();

  @HostListener('document:click', ['$event.target'])
  onPublicClick = (targetElement: HTMLElement) => {
    const clickedInside =
      this.content?.nativeElement.contains(targetElement) ||
      this.hostElement?.nativeElement.contains(targetElement);

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
    if (this.hostElement === null || this.content === null) return;

    const clientRect = this.hostElement.nativeElement.getBoundingClientRect();
    const contentRect = this.content.nativeElement.getBoundingClientRect();

    this.left = `${
      clientRect.left + clientRect.width / 2 - contentRect.width / 2
    }px`;
    this.top = `${clientRect.bottom + dropdownTopMargin}px`;

    this._cdRef.detectChanges();
  }

  ngOnInit(): void {}
}
