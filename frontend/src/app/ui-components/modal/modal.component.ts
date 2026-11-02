import {
  Component,
  ComponentRef,
  Input,
  OnInit,
  TemplateRef,
  ChangeDetectionStrategy,
  input,
  output,
  viewChild
} from '@angular/core';
import { PortalType } from 'src/app/services/portal/types';
import { PortalService } from '../../services/portal/PortalService';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { OnDestroy } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager
})
export class ModalComponent implements OnInit, OnDestroy {
  constructor(private _portalService: PortalService) {}
  modalContentComponent?: ModalContentComponent;

  readonly modalTitle = input('');
  readonly okText = input('OK');
  readonly cancelText = input('Cancel');
  readonly onOk = output();
  readonly onCancel = output();
  private modalContentRef?: ComponentRef<ModalContentComponent>;
  @Input()
  get okEnabled() {
    return this.modalContentComponent?.okEnabled();
  }
  set okEnabled(value: boolean | undefined) {
    this.modalContentRef?.setInput('okEnabled', value);
  }

  readonly templateRef = viewChild('content', { read: TemplateRef });
  subscriptions: { unsubscribe: () => void }[] = [];

  private _visible = false;
  @Input()
  get visible() {
    return this._visible;
  }
  set visible(value: boolean) {
    if (value === this._visible) return;

    this._visible = value;
    if (value) {
      this._portalService.add(
        ModalContentComponent,
        PortalType.Modal,
        (c) => {
          c.setInput('modalTitle', this.modalTitle());
          c.setInput('okText', this.okText());
          c.setInput('cancelText', this.cancelText());
          c.setInput('okEnabled', this.okEnabled);

          this.subscriptions.push(
            c.instance.onOk.subscribe(() => {
              this.onOk.emit();
            })
          );

          this.subscriptions.push(
            c.instance.onCancel.subscribe(() => {
              this.onCancel.emit();
            })
          );

          this.modalContentComponent = c.instance;
          this.modalContentRef = c;
        },
        [this.templateRef()?.createEmbeddedView({}).rootNodes!]
      );
    } else {
      this._portalService.clear(PortalType.Modal);
      this.subscriptions.forEach((s) => s.unsubscribe());
    }
  }

  ngOnInit(): void {}
  ngOnDestroy(): void {
    this._portalService.clear(PortalType.Modal);
  }
}
