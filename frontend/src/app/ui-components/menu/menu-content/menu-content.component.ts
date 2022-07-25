import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MenuItem } from '../types';
import { dropdownTopMargin } from './consts';

@Component({
  selector: 'app-menu-content',
  templateUrl: './menu-content.component.html',
  styleUrls: ['./menu-content.component.scss'],
})
export class MenuContentComponent implements OnInit, AfterViewChecked {
  @Input() elements: MenuItem[] = [];
  @Input() hostElement: ElementRef<HTMLElement> | null = null;
  @ViewChild('content') content: ElementRef<HTMLElement> | null = null;

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
