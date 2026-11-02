import { Component, ChangeDetectionStrategy, computed, input, output } from '@angular/core';
import { DropdownItem } from '../../../../ui-components/dropdown/types';
import { EditorAction } from '../../types';
import { DropdownComponent } from '../../../../ui-components/dropdown/dropdown.component';

@Component({
    selector: 'action-dropdown',
    templateUrl: './action-dropdown.component.html',
    styleUrls: ['./action-dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [DropdownComponent]
})
export class ActionDropdownComponent {
  dropdownItems: DropdownItem<EditorAction>[] = [
    { name: 'Trim', value: EditorAction.Trim },
    { name: 'Get BPM', value: EditorAction.GetBPM },
    { name: 'Mix', value: EditorAction.Mix },
  ];
  readonly onChange = output<EditorAction>();
  readonly bordered = input(true);
  readonly selectedValue = input<EditorAction | null>(null);
  readonly selectedIndex = computed(() => {
    const selectedValue = this.selectedValue();
    return selectedValue === null
      ? undefined
      : this.dropdownItems.findIndex((item) => item.value === selectedValue);
  });
}
