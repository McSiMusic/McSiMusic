import { Injectable } from '@angular/core';
import { of, takeUntil, takeWhile } from 'rxjs';
import { Track, User } from './types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserInfoService {
  private _tracksUrl = `${environment.backUrl}/tracks`;

  constructor(private _http: HttpClient) {}

  private _userInfo: User | null = null;
  setUserInfo(userInfo: User | null) {
    this._userInfo = userInfo;
  }

  get userInfo() {
    return this._userInfo;
  }

  get folders() {
    return this._userInfo?.folders;
  }

  getTracks(folder: string) {
    return this._http.get<Track[]>(this._tracksUrl, {
      params: { folder: folder },
      withCredentials: true,
    });
  }

  upload(files: FileList, folder: string) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }

    return this._http.post<Track[]>(this._tracksUrl, formData, {
      params: { folder },
      withCredentials: true,
    });
  }
}
