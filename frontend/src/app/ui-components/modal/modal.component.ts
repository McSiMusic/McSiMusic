import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { PortalType } from 'src/app/services/portal/types';
import { PortalService } from '../../services/portal/PortalService';
import { ModalContentComponent } from './modal-content/modal-content.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  constructor(private _portalService: PortalService) {}
  modalContentComponent?: ModalContentComponent;

  @Input() modalTitle = '';
  @Input() okText = 'OK';
  @Input() cancelText = 'Cancel';
  @Output() onOk = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Input()
  get okEnabled() {
    return this.modalContentComponent?.okEnabled;
  }
  set okEnabled(value: boolean | undefined) {
    if (this.modalContentComponent !== undefined) {
      this.modalContentComponent.okEnabled = value;
    }
  }

  @ViewChild('content', {
    static: true,
    read: TemplateRef,
  })
  templateRef?: TemplateRef<{}>;
  subscriptions: Subscription[] = [];

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
          c.instance.modalTitle = this.modalTitle;
          c.instance.okText = this.okText;
          c.instance.cancelText = this.cancelText;
          c.instance.okEnabled = this.okEnabled;

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
        },
        [this.templateRef?.createEmbeddedView({}).rootNodes!]
      );
    } else {
      this._portalService.clear(PortalType.Modal);
      this.subscriptions.forEach((s) => s.unsubscribe());
    }
  }

  ngOnInit(): void {}
}
