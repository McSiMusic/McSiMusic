import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { MenuItem } from './types';
import { PortalService } from '../../services/portal/PortalService';
import { MenuContentComponent } from './menu-content/menu-content.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {
  constructor(
    private _portalService: PortalService,
    private _elementRef: ElementRef
  ) {}
  @Input() elements: MenuItem[] = [];
  @Input() selectedIndex?: number;

  private _visible = false;
  get visible() {
    return this._visible;
  }
  set visible(value: boolean) {
    if (value === this._visible) return;

    this._visible = value;
    if (value) {
      this._portalService.add(MenuContentComponent, (c) => {
        c.instance.elements = this.elements;
        c.instance.hostElement = this._elementRef;
      });
    } else {
      this._portalService.clear();
    }
  }

  toggleVisible() {
    this.visible = !this.visible;
  }

  ngOnInit(): void {}
}
