import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActionsService } from 'src/app/services/ActionsService';

@Component({
  selector: 'app-get-bpm',
  templateUrl: './get-bpm.component.html',
  styleUrls: ['./get-bpm.component.scss'],
})
export class GetBpmComponent {
  constructor(private _actionsService: ActionsService) {}

  private _trackId?: string;
  @Input()
  set trackId(value: string | undefined) {
    this.bpm = undefined;
    this._trackId = value;
  }
  get trackId() {
    return this._trackId;
  }

  loading = false;
  bpm?: number;

  getBpm = () => {
    this.loading = true;
    this._actionsService.getBpm(this.trackId!).subscribe((result) => {
      this.loading = false;
      this.bpm = result;
    });
  };
}
