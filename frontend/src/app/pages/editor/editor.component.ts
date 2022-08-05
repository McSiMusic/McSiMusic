import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/services/types';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  constructor() {}

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
  };

  onCancel = () => {
    this.chooseFileModalVisible = false;
  };

  ngOnInit(): void {}
}
