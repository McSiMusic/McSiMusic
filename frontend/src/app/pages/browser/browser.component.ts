import { Component, OnInit, ChangeDetectionStrategy, input, output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfoService } from '../../services/UserInfoService';
import { map, Subject, mergeMap, BehaviorSubject } from 'rxjs';
import { Track } from 'src/app/services/types';
import { FoldersComponent } from './folders/folders.component';
import { TracksComponent } from './tracks/tracks.component';

@Component({
    selector: 'app-browser',
    templateUrl: './browser.component.html',
    styleUrls: ['./browser.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [FoldersComponent, TracksComponent]
})
export class BrowserComponent implements OnInit {
  constructor() {}

  readonly actionEnabled = input(true);
  readonly selectionChanged = output<Track | undefined>();

  ngOnInit(): void {}
}
