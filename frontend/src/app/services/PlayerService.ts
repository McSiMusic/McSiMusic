import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Track } from './types';
import { Howl } from 'howler';

const PLAYING_INTERVAL = 500;
@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor() {}

  currentSoundBufferProgressUpdated = new EventEmitter<number>();
  onPlaying = new EventEmitter<number>();

  private _currentSound?: Howl;
  private _currentTrack?: Track;
  private _sounds = new Map<string, Howl>();
  private _playingInterval?: number;

  setCurrentTrack = (track: Track) => {
    this._currentTrack = track;
    this._setCurrentSound(this._getSound(track));
  };

  get currentTrack() {
    return this._currentTrack;
  }

  private _setCurrentSound = (sound: Howl) => {
    if (sound === this._currentSound) return;

    if (this._currentSound) {
      sound.off('play', this._onPlay);
      sound.off('pause', this._onPause);
      sound.off('stop', this._onStop);
    }

    sound.on('play', this._onPlay);
    sound.on('pause', this._onPause);
    sound.on('stop', this._onStop);

    if (this._currentSound !== undefined) {
      const node = this._getNode(this._currentSound);
      node.removeEventListener('progress', this._loadListener);
    }

    this._currentSound = sound;
    this._listenLoading();
  };

  play(track: Track) {
    this._currentSound?.stop();
    this._currentTrack = track;
    const sound = this._getSound(track);
    sound.play();
    this._setCurrentSound(sound);
  }

  pause(track: Track) {
    this._getSound(track).pause();
  }

  resume(track: Track) {
    this._getSound(track).play();
  }

  private _listenLoading = () => {
    if (this._currentSound === undefined) return;
    const node = this._getNode(this._currentSound);
    node.addEventListener('progress', this._loadListener);
  };

  private _loadListener = (argNode: any) => {
    if (this._currentSound === undefined) return;

    const duration = this._currentTrack?.duration!;
    const node = this._getNode(this._currentSound);
    const length = node.buffered.length;
    const bufferProgress = (node.buffered.end(length - 1) / duration) * 100;
    this.currentSoundBufferProgressUpdated.emit(bufferProgress);
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
        preload: true,
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

  private _onPlay = (soundId: number) => {
    this._playingInterval = setInterval(this._onPlaying, PLAYING_INTERVAL);
  };

  private _onPause = (soundId: number) => {
    if (this._playingInterval !== undefined) {
      clearInterval(this._playingInterval);
      this._playingInterval = undefined;
    }
  };

  private _onStop = (soundId: number) => {
    if (this._playingInterval !== undefined) {
      clearInterval(this._playingInterval);
      this._playingInterval = undefined;
    }
  };

  private _onPlaying = () => {
    if (this._currentSound === undefined) return;

    const progress =
      (this._currentSound.seek() / this._currentSound.duration()) * 100;

    this.onPlaying.emit(progress);
  };
}
