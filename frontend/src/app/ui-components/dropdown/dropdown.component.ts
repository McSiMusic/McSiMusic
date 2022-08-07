import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { DropdownItem } from './types';
import { MenuItem } from '../menu/types';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
})
export class DropdownComponent<T> implements OnInit {
  @Input() items: DropdownItem<T>[] = [];
  @Input() selectedIndex?: number;
  @Input() placeholder = 'Choose value';
  @Input() bordered = true;
  @Output() onChange = new EventEmitter<T>();

  selectedValue: string = '';
  menuItems: MenuItem[] = [];
  visible = false;

  @ViewChild(MenuComponent) menuComponent?: MenuComponent;

  constructor() {
    this._updateSelectedValue();
  }

  ngOnInit(): void {
    this.menuItems = this.items.map((item, i) => ({
      action: () => this.onMenuItemClick(item, i),
      name: item.name,
    }));

    this._updateSelectedValue();
  }

  onMenuItemClick = (item: DropdownItem<T>, index: number) => {
    this.selectedIndex = index;
    this.menuComponent?.toggleVisible();
    this.onChange.emit(item.value);
  };

  toggleVisibility = () => {
    this.visible = !this.visible;
  };

  private _updateSelectedValue = () => {
    this.selectedValue =
      this.selectedIndex !== undefined
        ? this.menuItems[this.selectedIndex]?.name || this.placeholder
        : this.placeholder;
  };
}
