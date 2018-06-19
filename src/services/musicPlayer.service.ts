import { Injectable, EventEmitter } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media';

import { AlbumTrackOutDto } from '../models/trackOutDto';
import { Settings } from '../settings';

@Injectable()
export class MusicPlayer {
    playlist: Array<AlbumTrackOutDto>;
    currentTrack: AlbumTrackOutDto;
    playingTrack: MediaObject;
    public trackPlaying: EventEmitter<{playing: boolean, track: AlbumTrackOutDto}> = new EventEmitter<{playing: boolean, track: AlbumTrackOutDto}>();

    constructor(private media: Media) { }

    play(track: AlbumTrackOutDto) {
        if(this.playingTrack) this.playingTrack.stop();
        this.currentTrack = track;
        console.log('create media', Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + track.file + '.' + track.format);
        this.playingTrack = this.media.create(Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + track.file + '.' + track.format);
        this.playingTrack.play();
        this.trackPlaying.emit({playing: true, track: track});
    }

    pause() {
        this.playingTrack.pause();
        this.trackPlaying.emit({playing: false, track: this.currentTrack});
    }
}