import { Component, Input, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
})
export class ModalContentComponent implements OnInit {
  constructor() {}

  @Input() modalTitle = '';
  @Input() okText = 'OK';
  @Input() cancelText = 'Cancel';
  @Input() okEnabled? = true;
  @Input() onOk = new EventEmitter();
  @Input() onCancel = new EventEmitter();

  ngOnInit(): void {}
}
