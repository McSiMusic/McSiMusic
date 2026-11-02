import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  computed,
  input,
  model,
  output,
  viewChild
} from '@angular/core';
import { DropdownItem } from './types';
import { MenuItem } from '../menu/types';
import { MenuComponent } from '../menu/menu.component';
import { ButtonComponent } from '../button/button.component';
import { DropdownIconComponent } from '../../icons/dropdown-icon/dropdown-icon.component';

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MenuComponent, ButtonComponent, DropdownIconComponent]
})
export class DropdownComponent<T> implements OnInit {
  readonly items = input<DropdownItem<T>[]>([]);
  readonly selectedIndex = model<number>();
  readonly placeholder = input('Choose value');
  readonly bordered = input(true);
  readonly onChange = output<T>();

  selectedValue = computed(() => {
    const index = this.selectedIndex();
    return index !== undefined
      ? this.menuItems[index]?.name || this.placeholder()
      : this.placeholder();
  });
  menuItems: MenuItem[] = [];
  visible = false;

  readonly menuComponent = viewChild(MenuComponent);

  constructor() {
  }

  ngOnInit(): void {
    this.menuItems = this.items().map((item, i) => ({
      action: () => this.onMenuItemClick(item, i),
      name: item.name,
    }));

  }

  onMenuItemClick = (item: DropdownItem<T>, index: number) => {
    this.selectedIndex.set(index);
    this.menuComponent()?.toggleVisible();
    this.onChange.emit(item.value);
  };

  toggleVisibility = () => {
    this.visible = !this.visible;
  };
}
