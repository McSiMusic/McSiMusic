import { Component, OnInit } from '@angular/core';
import { Track } from 'src/app/services/types';
import { EditorState, EditorAction } from './types';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  EditorStateEnum = EditorState;
  EditorActionEnum = EditorAction;

  state = EditorState.NoFileChoosen;
  action: EditorAction | null = null;
  currentTrack?: Track;

  onTrackSelected = (track: Track) => {
    if (this.currentTrack === track) return;
    this.currentTrack = track;
    this.action = null;
    this.state = EditorState.NoActionChoosen;
  };

  onActionChange = (action: EditorAction) => {
    if (this.action === action) return;
    this.action = action;
    this.state = EditorState.ActionChoosen;
  };

  constructor() {}

  ngOnInit(): void {}
}
