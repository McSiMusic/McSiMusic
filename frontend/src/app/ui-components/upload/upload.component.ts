import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnInit {
  constructor() {}

  @Output() onUpload = new EventEmitter<FileList | File[]>();
  @Output() onEnter = new EventEmitter();
  @Output() onLeave = new EventEmitter();
  @Input() isDnd = false;

  @ViewChild('uploader')
  uploaderElement: ElementRef<HTMLInputElement> | null = null;

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

  ngOnInit(): void {}
}
