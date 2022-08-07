import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ActionsService {
  private _getBpmUrl = `${environment.backUrl}/bpm`;
  constructor(private _http: HttpClient) {}

  getBpm = (trackId: string) => {
    return this._http.get<number>(this._getBpmUrl, {
      params: { trackId },
      withCredentials: true,
    });
  };
}
