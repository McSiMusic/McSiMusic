import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Track } from 'src/app/services/types';

@Component({
  selector: 'app-track-dialog',
  templateUrl: './app-track-dialog.component.html',
  styleUrls: ['./app-track-dialog.component.scss'],
})
export class TrackDialogComponent {
  constructor() {}

  @Input() buttonCaption = 'Choose file';
  @Output() onTrackSelected = new EventEmitter<Track>();
  chooseFileModalVisible = false;
  selectedTrack?: Track;

  onChooseClick = () => {
    this.chooseFileModalVisible = true;
  };

  onSelectionChanged = (track?: Track) => {
    this.selectedTrack = track;
  };

  isTrackSelected = () => {
    return this.selectedTrack !== undefined;
  };

  onOk = () => {
    console.log(this.selectedTrack);
    this.chooseFileModalVisible = false;
    this.onTrackSelected.emit(this.selectedTrack);
  };

  onCancel = () => {
    this.chooseFileModalVisible = false;
  };

  onDoubleClick = (track: Track) => {
    this.chooseFileModalVisible = false;
    this.selectedTrack = track;
    this.onTrackSelected.emit(this.selectedTrack);
  };
}
