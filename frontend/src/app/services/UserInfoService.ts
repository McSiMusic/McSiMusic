import { Injectable } from '@angular/core';
import { BehaviorSubject, of, takeUntil, takeWhile } from 'rxjs';
import { Track, User } from './types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserInfoService {
  private _tracksUrl = `${environment.backUrl}/tracks`;
  currentFolder = new BehaviorSubject<string | null>(null);

  constructor(private _http: HttpClient) {}

  private _userInfo: User | null = null;
  setUserInfo(userInfo: User | null) {
    this._userInfo = userInfo;
    this.currentFolder.next(this._userInfo?.folders[0]!);
  }

  get userInfo() {
    return this._userInfo;
  }

  get folders() {
    return this._userInfo?.folders;
  }

  getTracks(folder: string, page: number, size = 10) {
    const offset = page * size;
    return this._http.get<Track[]>(this._tracksUrl, {
      params: { folder, offset, size },
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
