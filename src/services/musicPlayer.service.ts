import { Injectable, EventEmitter } from '@angular/core';
import { Media, MediaObject, MEDIA_STATUS } from '@ionic-native/media';

import { AlbumTrackOutDto } from '../models/trackOutDto';
import { Settings } from '../settings';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MusicService } from './music.service';
import { Subject } from 'rxjs/Subject';
import { TrackQueryParameters } from '../models/trackQueryParameters';
import * as _ from 'lodash';

@Injectable()
export class MusicPlayer {
    private playlist: Array<AlbumTrackOutDto>;
    private currentTrack: AlbumTrackOutDto;
    private playingTrack: MediaObject;
    private musicStatus: Subscription;
    private volume: number = 0.5;
    private position: number;
    private positionSubscription: Subscription;
    private searchParams: any = null;
    private trackIndex: number;
    public trackTimer: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    public trackPlaying: Subject<{ playing: boolean, track: AlbumTrackOutDto }> = new Subject<{ playing: boolean, track: AlbumTrackOutDto }>();

    constructor(private media: Media, private musicService: MusicService) { }

    setMusicWatcher() {
        this.musicStatus = this.playingTrack.onStatusUpdate.subscribe((status: MEDIA_STATUS) => {
            console.log('playingTrack status', status);
            switch (status) {
                case MEDIA_STATUS.STARTING:
                    this.position = 0;
                case MEDIA_STATUS.RUNNING:
                    if (this.positionSubscription) this.positionSubscription.unsubscribe();
                    this.positionSubscription = this.trackTimer.defaultIfEmpty().subscribe(newPosition => {
                        this.playingTrack.getCurrentPosition().then(position => {
                            setTimeout(() => {
                                this.position = position * 1000;
                                this.trackTimer.next(this.position);
                            }, 30);
                        });
                    });
                    break;
                case MEDIA_STATUS.PAUSED:
                    this.positionSubscription.unsubscribe();
                    break;
                case MEDIA_STATUS.STOPPED:
                    console.log('MEDIA STOPP');
                    this.position = 0;
                    this.trackTimer.next(this.position);
                    this.positionSubscription.unsubscribe();
                    if (this.playlist && this.trackIndex + 1 < this.playlist.length) {
                        this.trackIndex++;
                        this.playTrack(this.playlist[this.trackIndex]);
                        if (this.trackIndex == this.playlist.length) {
                            this.searchNextPlalistPage();
                        }
                    } else {
                        this.trackPlaying.next({ playing: false, track: null });
                    }
                    break;
            }
        })
    }

    setPosition(value: number): Promise<void> {
        return new Promise((resolve) => {
            this.position = value;
            this.positionSubscription.unsubscribe();
            this.trackTimer.next(value);
            setTimeout(() => {
                this.playingTrack.seekTo(value);
                resolve();
            }, 35);
        });
    }

    previous() {
        console.log('previous');
        if (this.playlist && this.trackIndex > 0) {
            this.trackIndex --;
            this.playTrack(this.playlist[this.trackIndex]);
        }
    }

    next(): Promise<void> {
        return new Promise<void>((resolve) => {
            console.log('next');
            if (this.playlist && this.trackIndex + 1 < this.playlist.length) {
                this.trackIndex++;
                this.playTrack(this.playlist[this.trackIndex]);
                if (this.trackIndex + 1 == this.playlist.length) {
                    this.searchNextPlalistPage().then(() => resolve());
                } else {
                    resolve();
                }
            } else {
                resolve();
            }
        });
    }

    startRandom() {
        this.musicService.getRandomTracks()
            .subscribe(tracks => {
                this.searchParams = 'random';
                this.releaseCurrentTrack();
                this.playlist = tracks;
                this.currentTrack = tracks[0];
                this.playingTrack = this.media.create(Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + tracks[0].file + '.' + tracks[0].format);
                this.setMusicWatcher();
                this.playingTrack.play();
                // this.easeIn();
                this.trackIndex = 0;
                this.trackPlaying.next({ playing: true, track: tracks[this.trackIndex] });
            });
    }

    startSingleTrack(track: AlbumTrackOutDto) {
        console.log('startSingleTrack');
        if (this.currentTrack && this.currentTrack._id != track._id || !this.currentTrack) { // Start new track
            this.releaseCurrentTrack();
            this.currentTrack = track;
            console.log('create media', Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + track.file + '.' + track.format);
            this.playingTrack = this.media.create(Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + track.file + '.' + track.format);
            this.playingTrack.onStatusUpdate.filter(status => status == MEDIA_STATUS.STOPPED).subscribe(() => this.trackPlaying.next({ playing: false, track: null }));
            this.setMusicWatcher();
        }
        this.playingTrack.play();
        // this.easeIn();
        this.trackPlaying.next({ playing: true, track: track });
    }

    startPlaylist(tracks: Array<AlbumTrackOutDto>, settings?: { searchParams?: TrackQueryParameters, position?: number }) {
        console.log('settings', settings);
        if (settings) {
            if (settings.searchParams) {
                this.searchParams = _.cloneDeep(settings.searchParams);
                this.searchParams.page = 1;
            } else {
                this.searchParams = { page: 1 };
            }
        }
        this.playlist = _.cloneDeep(tracks); // cloneDeep PREVENTS TRACK FROM BEEING ADDED IN THE VIEW
        this.releaseCurrentTrack();
        this.trackIndex = (settings && settings.position) ? settings.position : 0
        this.playTrack(tracks[this.trackIndex]);
        if (this.trackIndex + 1 == this.playlist.length) {
            this.searchNextPlalistPage();
        }
    }

    private playTrack(track: AlbumTrackOutDto) {
        console.log('playTrack', track);
        this.releaseCurrentTrack();
        this.currentTrack = track;
        console.log('create media', Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + track.file + '.' + track.format);
        this.playingTrack = this.media.create(Settings.ApiHost + ':' + Settings.ApiPort + '/files/music/' + track.file + '.' + track.format);
        this.setMusicWatcher();
        this.playingTrack.play();
        // this.easeIn();
        this.trackPlaying.next({ playing: true, track: track });
    }

    pause() {
        // this.easeOut();
        this.playingTrack.pause();
        this.trackPlaying.next({ playing: false, track: this.currentTrack });
    }

    play() {
        this.trackPlaying.next({ playing: true, track: this.currentTrack });
        console.log('PLAY');
        this.playingTrack.play();
        // this.easeIn();
    }

    private findTrack(track: AlbumTrackOutDto, currentTrack: AlbumTrackOutDto): boolean {
        return (track._id == currentTrack._id);
    }

    private searchNextPlalistPage() {
        return new Promise<void>((resolve) => {
            console.log('searchNextPlalistPage', this.searchParams);
            if (this.searchParams == null) resolve();
            else {
                if (this.searchParams == 'random') {
                    this.musicService.getRandomTracks().subscribe(res => {
                        res.forEach(track => this.playlist.push(track));
                        console.log('this.playlist', this.playlist)
                        resolve();
                    });
                } else {
                    this.searchParams.page++;
                    this.musicService.getTracks(this.searchParams).subscribe(res => {
                        res.forEach(track => this.playlist.push(track));
                        resolve();
                    });
                }
            }
        })
    }

    private releaseCurrentTrack() {
        if (this.playingTrack) {
            console.log('this.musicStatus', this.musicStatus)
            if (this.musicStatus) this.musicStatus.unsubscribe();
            if (this.playingTrack) {
                this.playingTrack.stop();
                this.playingTrack.release();
            }
        }
    }

    private easeIn() {
        let tmpVolume = 0;
        this.playingTrack.setVolume(tmpVolume);
        this.playingTrack.play();
        this.raiseVolume(0, this.volume);
    }

    private raiseVolume(volume, targetVolume) {
        volume += 0.02;
        if (volume < targetVolume) {
            setTimeout(() => {
                this.playingTrack.setVolume(volume);
                this.raiseVolume(volume, this.volume);
            }, 50);
        }
    }

    private easeOut() {
        this.reduceVolume(this.volume);
    }

    private reduceVolume(volume) {
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