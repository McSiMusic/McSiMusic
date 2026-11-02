import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CloseIconComponent } from '../../../icons/close-icon/close-icon.component';
import { ButtonComponent } from '../../button/button.component';

@Component({
    selector: 'app-modal-content',
    templateUrl: './modal-content.component.html',
    styleUrls: ['./modal-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [CloseIconComponent, ButtonComponent]
})
export class ModalContentComponent {
  readonly modalTitle = input('');
  readonly okText = input('OK');
  readonly cancelText = input('Cancel');
  readonly okEnabled = input<boolean | undefined>(true);
  readonly onOk = output<void>();
  readonly onCancel = output<void>();
}
