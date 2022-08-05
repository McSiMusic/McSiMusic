import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfoService } from '../../services/UserInfoService';
import { map, Subject, mergeMap, BehaviorSubject } from 'rxjs';
import { Track } from 'src/app/services/types';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
})
export class BrowserComponent implements OnInit {
  constructor() {}

  @Input() actionEnabled = true;
  @Output() selectionChanged = new EventEmitter<Track | undefined>();

  ngOnInit(): void {}
}
