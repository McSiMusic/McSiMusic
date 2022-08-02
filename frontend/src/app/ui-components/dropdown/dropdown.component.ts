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
export class DropdownComponent implements OnInit {
  @Input() items: DropdownItem[] = [];
  @Input() initalSelectedIndex?: number;
  @Input() placeholder = 'Choose value';
  @Output() onChange = new EventEmitter<string>();
  menuItems: MenuItem[] = [];
  visible = false;

  @ViewChild(MenuComponent) menuComponent?: MenuComponent;

  constructor() {}

  ngOnInit(): void {
    this.menuItems = this.items.map((i) => ({
      action: () => this.onMenuItemClick(i),
      name: i.name,
    }));
  }

  onMenuItemClick = (item: DropdownItem) => {
    this.onChange.emit(item.value);
  };

  toggleVisibility = () => {
    this.visible = !this.visible;
  };

  get selectedValue() {
    return this.initalSelectedIndex
      ? this.menuComponent?.elements[this.initalSelectedIndex]?.name ||
          this.placeholder
      : this.placeholder;
  }
}
