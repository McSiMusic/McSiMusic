import { Component, OnInit, ElementRef, ChangeDetectionStrategy, input, OutputRefSubscription } from '@angular/core';
import { MenuItem } from './types';
import { PortalService } from '../../services/portal/PortalService';
import { MenuContentComponent } from './menu-content/menu-content.component';
import { PortalType } from '../../services/portal/types';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class MenuComponent implements OnInit {
  constructor(
    private _portalService: PortalService,
    private _elementRef: ElementRef
  ) {}

  readonly elements = input<MenuItem[]>([]);
  readonly selectedIndex = input<number>();
  menuContentElement?: MenuContentComponent;
  private _onOutsideClickSubscription?: OutputRefSubscription;

  private _visible = false;
  get visible() {
    return this._visible;
  }
  set visible(value: boolean) {
    if (value === this._visible) return;

    this._visible = value;
    if (value) {
      this._portalService.add(
        MenuContentComponent,
        PortalType.Dropdown,
        (c) => {
          this.menuContentElement = c.instance;
          c.setInput('elements', this.elements());
          c.setInput('hostElement', this._elementRef);
          c.setInput('selectedIndex', this.selectedIndex());
          this._onOutsideClickSubscription =
            this.menuContentElement.onOutsideClick.subscribe(
              this.onClickOutside
            );
        }
      );
    } else {
      this._onOutsideClickSubscription?.unsubscribe();
      this._portalService.clear(PortalType.Dropdown);
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
