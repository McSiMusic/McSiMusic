import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Track } from 'src/app/services/types';
import { EditorState, EditorAction } from './types';
import { ActionDropdownComponent } from './components/no-action/action-dropdown.component';
import { TrackDialogComponent } from './components/track-dialog/app-track-dialog.component';
import { GetBpmComponent } from './components/get-bpm/get-bpm.component';
import { TrimComponent } from './components/trim/trim.component';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ActionDropdownComponent, TrackDialogComponent, GetBpmComponent, TrimComponent]
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
