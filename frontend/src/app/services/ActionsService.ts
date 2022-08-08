import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ActionsService {
  private _getBpmUrl = `${environment.backUrl}/bpm`;
  private _getWaveFormUrl = `${environment.backUrl}/waveform`;

  constructor(private _http: HttpClient) {}

  getBpm = (trackId: string) => {
    return this._http.get<number>(this._getBpmUrl, {
      params: { trackId },
      withCredentials: true,
    });
  };

  getWaveForm = (trackId: string) => {
    return this._http.get(this._getWaveFormUrl, {
      params: { trackId },
      withCredentials: true,
      observe: 'response',
      responseType: 'blob',
    });
  };
}
