import { Injectable, EventEmitter } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media';

import { AlbumTrackOutDto } from '../models/trackOutDto';

@Injectable()
export class MusicPlayer {
    playlist: Array<AlbumTrackOutDto>;
    currentTrack: AlbumTrackOutDto;
    playingTrack: MediaObject;
    public trackPlaying: EventEmitter<string> = new EventEmitter<string>();

    constructor(private media: Media) { }

    play(track: AlbumTrackOutDto) {
        if(this.playingTrack) this.playingTrack.stop();
        this.playingTrack = this.media.create('http://192.168.1.24:3000/files/music/' + track.file + '.' + track.format);
        this.playingTrack.play();
        this.trackPlaying.emit(track._id);
    }

    pause() {
        this.playingTrack.pause();
        this.trackPlaying.emit(null);
    }
}