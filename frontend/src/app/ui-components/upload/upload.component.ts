import {
  Component,
  ElementRef,
  EventEmitter,
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

  @Output() onUpload = new EventEmitter<FileList>();

  @ViewChild('uploader')
  uploaderElement: ElementRef<HTMLInputElement> | null = null;

  uploadFile(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.onUpload.emit(inputElement.files!);
  }

  ngOnInit(): void {}
}
