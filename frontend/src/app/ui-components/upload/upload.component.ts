import {
  Component,
  ChangeDetectionStrategy,
  input,
  output
} from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ButtonComponent, NgTemplateOutlet]
})
export class UploadComponent {
  constructor() {}

  readonly onUpload = output<FileList | File[]>();
  readonly onEnter = output();
  readonly onLeave = output();
  readonly isDnd = input(false);

  uploadFile(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.onUpload.emit(inputElement.files!);
  }

  onDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  onDragLeave = (event: DragEvent) => {
    this.onLeave.emit();
  };

  onDragEnter = (event: DragEvent) => {
    this.onEnter.emit();
  };

  onDragEnd = (event: DragEvent) => {
    event.preventDefault();

    const files = event.dataTransfer?.files;
    if (files === undefined) return;

    const audioFiles = Array.from(files).filter((f) => f.type === 'audio/mpeg');
    this.onUpload.emit(audioFiles);
  };
}
