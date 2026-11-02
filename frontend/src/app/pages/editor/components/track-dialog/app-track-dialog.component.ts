import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Track } from 'src/app/services/types';
import { ButtonComponent } from '../../../../ui-components/button/button.component';
import { ModalComponent } from '../../../../ui-components/modal/modal.component';
import { FoldersComponent } from '../../../browser/folders/folders.component';
import { TracksComponent } from '../../../browser/tracks/tracks.component';

@Component({
    selector: 'app-track-dialog',
    templateUrl: './app-track-dialog.component.html',
    styleUrls: ['./app-track-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ButtonComponent, ModalComponent, FoldersComponent, TracksComponent]
})
export class TrackDialogComponent {
  constructor() {}

  readonly buttonCaption = input('Choose file');
  readonly onTrackSelected = output<Track>();
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
    if (this.selectedTrack === undefined) return;
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
