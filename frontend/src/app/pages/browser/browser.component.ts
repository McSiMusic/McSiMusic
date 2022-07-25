import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserInfoService } from '../../services/UserInfoService';
import { map, Subject, mergeMap, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-browser',
  templateUrl: './browser.component.html',
  styleUrls: ['./browser.component.scss'],
})
export class BrowserComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
