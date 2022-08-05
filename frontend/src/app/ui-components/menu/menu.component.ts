import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { MenuItem } from './types';
import { PortalService } from '../../services/portal/PortalService';
import { MenuContentComponent } from './menu-content/menu-content.component';
import { Subscription } from 'rxjs';

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
  menuContentElement?: MenuContentComponent;
  private _onOutsideClickSubscription?: Subscription;

  private _visible = false;
  get visible() {
    return this._visible;
  }
  set visible(value: boolean) {
    if (value === this._visible) return;

    this._visible = value;
    if (value) {
      this._portalService.add(MenuContentComponent, (c) => {
        this.menuContentElement = c.instance;
        this.menuContentElement.elements = this.elements;
        this.menuContentElement.hostElement = this._elementRef;
        this._onOutsideClickSubscription =
          this.menuContentElement.onOutsideClick.subscribe(this.onClickOutside);
      });
    } else {
      this.menuContentElement?.onOutsideClick.unsubscribe();
      this._onOutsideClickSubscription?.unsubscribe();
      this._portalService.clear();
    }
  }

  onClickOutside = () => {
    this.visible = false;
  };

  toggleVisible() {
    this.visible = !this.visible;
  }

  ngOnInit(): void {}
}
