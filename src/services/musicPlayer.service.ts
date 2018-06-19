import { Injectable, EventEmitter } from '@angular/core';
import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media';

import { AlbumTrackOutDto } from '../models/trackOutDto';
import { Settings } from '../settings';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class MusicPlayer {
    playlist: Array<AlbumTrackOutDto>;
    currentTrack: AlbumTrackOutDto;
    playingTrack: MediaObject;
    public trackPlaying: EventEmitter<{ playing: boolean, track: AlbumTrackOutDto }> = new EventEmitter<{ playing: boolean, track: AlbumTrackOutDto }>();
    musicStatus: Subscription;
    volume: number = 0.5;

    constructor(private media: Media) { }

    setMusicWatcher() {
        this.musicStatus = this.playingTrack.onStatusUpdate.subscribe((status: MEDIA_STATUS) => {
            console.log('playingTrack status', status);
            if (status == MEDIA_STATUS.STOPPED) {
                console.log('MEDIA STOPP')
                if (this.playlist.findIndex(track => this.findTrack(track, this.currentTrack)) + 1 < this.playlist.length) {
                    this.playTrack(this.playlist[this.playlist.findIndex(track => this.findTrack(track, this.currentTrack)) + 1]);
                } else {
                    this.trackPlaying.emit({ playing: false, track: null });
                }
            }
        })
    }

    previous() {
        console.log('previous');
        if (this.playlist && this.playlist.findIndex(track => this.findTrack(track, this.currentTrack)) > 0) {
            this.playTrack(this.playlist[this.playlist.findIndex(track => this.findTrack(track, this.currentTrack)) - 1]);
        }
    }

    next() {
        console.log('next');
        if (this.playlist && this.playlist.findIndex(track => this.findTrack(track, this.currentTrack)) + 1 < this.playlist.length) {
            this.playTrack(this.playlist[this.playlist.findIndex(track => this.findTrack(track, this.currentTrack)) + 1]);
        }
    }

    startSingleTrack(track: AlbumTrackOutDto) {
        console.log('startSingleTrack');
        if (this.currentTrack && this.currentTrack._id != track._id || !this.currentTrack) { // Start new track
            this.releaseCurrentTrack();
            this.currentTrack = track;
            console.log('create media', Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + track.file + '.' + track.format);
            this.playingTrack = this.media.create(Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + track.file + '.' + track.format);
            this.playingTrack.onStatusUpdate.filter(status => status == MEDIA_STATUS.STOPPED).subscribe(() => this.trackPlaying.emit({ playing: false, track: null }));
        }
        this.easeIn();
        this.trackPlaying.emit({ playing: true, track: track });
    }

    startPlaylist(tracks: Array<AlbumTrackOutDto>) {
        this.releaseCurrentTrack();
        this.playlist = tracks;
        console.log('create media', Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + tracks[0].file + '.' + tracks[0].format);
        this.currentTrack = tracks[0];
        this.playingTrack = this.media.create(Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + tracks[0].file + '.' + tracks[0].format);
        this.setMusicWatcher();
        this.easeIn();
        this.trackPlaying.emit({ playing: true, track: tracks[0] });
    }

    private playTrack(track: AlbumTrackOutDto) {
        console.log('playTrack', track);
        this.releaseCurrentTrack();
        this.currentTrack = track;
        console.log('create media', Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + track.file + '.' + track.format);
        this.playingTrack = this.media.create(Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + track.file + '.' + track.format);
        this.setMusicWatcher();
        this.easeIn();
        this.trackPlaying.emit({ playing: true, track: track });
    }

    pause() {
        this.easeOut();
        this.trackPlaying.emit({ playing: false, track: this.currentTrack });
    }

    findTrack(track: AlbumTrackOutDto, currentTrack: AlbumTrackOutDto): boolean {
        return (track._id == currentTrack._id);
    }

    releaseCurrentTrack() {
        if (this.playingTrack) {
            console.log('this.musicStatus', this.musicStatus)
            if (this.musicStatus) this.musicStatus.unsubscribe();
            if (this.playingTrack) {
                this.playingTrack.stop();
                this.playingTrack.release();
            }
        }
    }

    easeIn() {
        let tmpVolume = 0;
        this.playingTrack.setVolume(tmpVolume);
        this.playingTrack.play();
        this.raiseVolume(0, this.volume);
    }

    raiseVolume(volume, targetVolume) {
        volume += 0.02;
        if (volume < targetVolume) {
            setTimeout(() => {
                this.playingTrack.setVolume(volume);
                this.raiseVolume(volume, this.volume);
            }, 50);
        }
    }

    easeOut() {
        this.reduceVolume(this.volume);
    }

    reduceVolume(volume) {
        volume -= 0.05;
        if (volume > 0) {
            setTimeout(() => {
                this.playingTrack.setVolume(volume);
                this.reduceVolume(volume);
            }, 10);
        } else {
            this.playingTrack.pause();
        }
    }
}