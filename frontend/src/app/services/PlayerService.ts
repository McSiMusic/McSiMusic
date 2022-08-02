import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Track } from './types';
import { Howl } from 'howler';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor() {}

  currentSoundBufferProgressUpdated = new EventEmitter<number>();
  private _currentSound?: Howl;
  private _currentTrack?: Track;
  private _currentPlayId?: number;
  private _sounds = new Map<string, Howl>();
  private _pauseSeek?: number;

  play(track: Track) {
    this._currentSound?.stop();
    this._currentTrack = track;
    const sound = this._getSound(track);
    this._currentPlayId = sound.play(this._currentPlayId);

    if (this._pauseSeek) {
      sound.seek(this._pauseSeek, this._currentPlayId);
      this._pauseSeek = undefined;
    }

    if (this._currentSound !== undefined) {
      const node = this._getNode(this._currentSound);
      node.removeEventListener('progress', this._loadListener);
    }
    this._currentSound = sound;
    this._listenLoading();
  }

  pause(track: Track) {
    this._pauseSeek = this._getSound(track)
      .pause(this._currentPlayId)
      .seek(this._currentPlayId);
  }

  resume(track: Track) {
    this._getSound(track).play();
  }

  private _listenLoading = () => {
    if (this._currentSound === undefined) return;
    const node = this._getNode(this._currentSound);
    node.addEventListener('progress', this._loadListener);
  };

  private _loadListener = () => {
    if (this._currentSound === undefined) return;

    const duration = this._currentSound.duration();
    const node = this._getNode(this._currentSound);
    const length = node.buffered.length;

    if (duration === 0) return;
    for (let i = 0; i < length; i++) {
      if (node.buffered.start(length - 1 - i) < node.currentTime) {
        const bufferProgress =
          (node.buffered.end(length - 1 - i) / duration) * 100;
        this.currentSoundBufferProgressUpdated.emit(bufferProgress);
      }
    }
  };

  private _getNode(sound: Howl) {
    return (sound as any)._sounds[0]._node;
  }

  private _getSound = (track: Track) => {
    const hasSound = this._sounds.has(track._id);
    if (!hasSound) {
      var sound = new Howl({
        src: `${environment.backUrl}/track?trackId=${track._id}`,
        xhr: { withCredentials: true },
        format: 'mp3',
        html5: true,
      });

      this._sounds.set(track._id, sound);
    }

    return this._sounds.get(track._id)!;
  };

  isCurrentTrack(track: Track) {
    return this._currentTrack?._id === track._id;
  }

  isPlaying = () => {
    return this._currentSound?.playing();
  };

  isCurrentTrackPlaying = (track: Track) => {
    return this.isCurrentTrack(track) && this.isPlaying();
  };
}
