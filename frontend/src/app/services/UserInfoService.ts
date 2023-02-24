import { Injectable } from '@angular/core';
import { BehaviorSubject, of, takeUntil, takeWhile, tap } from 'rxjs';
import { Track, User } from './types';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SortOrder } from '../pages/browser/tracks/types';
import { TRACK_PAGE_SIZE } from './consts';
import { downloadBlob, downloadURI } from '../utils/download';

@Injectable({ providedIn: 'root' })
export class UserInfoService {
  private _tracksUrl = `${environment.backUrl}/tracks`;
  private _folderUrl = `${environment.backUrl}/folder`;
  private _trackUrl = `${environment.backUrl}/track`;
  private _trackUrlMetadata = `${environment.backUrl}/track/metadata`;
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

  getTracks(
    folder: string,
    page: number,
    filter: string = '',
    sort: keyof Track = 'date',
    order: SortOrder = SortOrder.Desc,
    size = TRACK_PAGE_SIZE
  ) {
    const offset = page * size;
    return this._http.get<Track[]>(this._tracksUrl, {
      params: { folder, offset, size, filter, order, sort },
      withCredentials: true,
    });
  }

  upload(files: FileList | File[], folder: string) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i], files[i].name);
    }

    return this._http.post<Track[]>(this._tracksUrl, formData, {
      params: { folder },
      withCredentials: true,
      reportProgress: true,
      observe: 'events',
      headers: { 'Content-Transfer-Encoding': 'utf-8' },
    });
  }

  addFolder = (folder: string) => {
    return this._http
      .post<string[]>(this._folderUrl, { folder }, { withCredentials: true })
      .pipe(
        tap((folders) => {
          if (this._userInfo != null) this._userInfo.folders = folders;
        })
      );
  };

  deleteFolder = (folder: string) => {
    return this._http
      .delete<string[]>(this._folderUrl, {
        body: { folder },
        withCredentials: true,
      })
      .pipe(
        tap((folders) => {
          if (this._userInfo != null) this._userInfo.folders = folders;
        })
      );
  };

  patchFolder = (folder: string, oldFolder: string) => {
    return this._http
      .patch<string[]>(
        this._folderUrl,
        { body: { folder, oldFolder } },
        { withCredentials: true }
      )
      .pipe(
        tap((folders) => {
          if (this._userInfo != null) this._userInfo.folders = folders;
        })
      );
  };

  getTrack = (trackId: string) => {
    return this._http.get(this._trackUrl, {
      withCredentials: true,
      params: { trackId },
      observe: 'response',
      responseType: 'blob',
    });
  };

  getTrackMeta = (trackId: string) => {
    return this._http.get<Track>(this._trackUrlMetadata, {
      withCredentials: true,
      params: { trackId },
    });
  }


  downloadTrack = (track: Track) => {
    this.getTrack(track._id).subscribe((res) => {
      downloadBlob(res.body!, `${track.name}.mp3`);
    });
  };

  deleteTrack = (track: Track) => {
    return this._http.delete(this._trackUrl, {
      withCredentials: true,
      params: { trackId: track._id },
    });
  };
}
