import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/services/types';
import { EditorState } from './types';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  EditorStateEnum = EditorState;
  state = EditorState.ChooseTrack;
  currentTrack?: Track;

  onTrackSelected = (track: Track) => {
    this.currentTrack = track;
    this.state = EditorState.ChooseAction;
  };

  constructor() {}

  ngOnInit(): void {}
}
