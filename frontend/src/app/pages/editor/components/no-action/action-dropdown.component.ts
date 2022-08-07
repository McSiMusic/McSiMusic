import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DropdownItem } from '../../../../ui-components/dropdown/types';
import { EditorAction } from '../../types';

@Component({
  selector: 'action-dropdown',
  templateUrl: './action-dropdown.component.html',
  styleUrls: ['./action-dropdown.component.scss'],
})
export class ActionDropdownComponent implements OnInit {
  dropdownItems: DropdownItem<EditorAction>[] = [
    { name: 'Trim', value: EditorAction.Trim },
    { name: 'Get BPM', value: EditorAction.GetBPM },
    { name: 'Mix', value: EditorAction.Mix },
  ];
  selectedIndex?: number;

  @Output() onChange = new EventEmitter<EditorAction>();
  @Input() bordered = true;
  @Input() set selectedValue(value: EditorAction) {
    this.selectedIndex = this.dropdownItems.findIndex((i) => i.value === value);
  }

  constructor() {}

  ngOnInit(): void {}
}
