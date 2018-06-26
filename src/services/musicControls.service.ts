import { MusicControls } from '@ionic-native/music-controls';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { MusicPlayer } from './musicPlayer.service';
import { AlbumTrackOutDto } from '../models/trackOutDto';

@Injectable()
export class MusicControlsService {

    currentTrack: AlbumTrackOutDto;

    constructor(private musicControls: MusicControls, platform: Platform, private player: MusicPlayer) {
        platform.ready().then(() => {
            player.trackPlaying.subscribe(state => {
                console.log('[MUSIC_CONTROL] trackPlaying', state);
                if (state) {
                    if (this.currentTrack && state.track._id == this.currentTrack._id) {
                        console.log('[MUSIC_CONTROL] updateIsPlaying', state.playing);
                        this.musicControls.updateIsPlaying(state.playing);
                    }
                    if (!this.currentTrack || state.track._id != this.currentTrack._id) {
                        this.currentTrack = state.track;
                        console.log('[MUSIC_CONTROL] Create', this.currentTrack);
                        this.createControl(state.track);
                        console.log('[MUSIC_CONTROL] created');
                        this.subscribeToControl();
                        this.musicControls.listen();
                        this.musicControls.updateIsPlaying(true);
                    }
                } else {
                    if (this.musicControls) {
                        this.musicControls.destroy();
                    }
                }
            });
        });
    }

    createControl(track: AlbumTrackOutDto) {
        console.log('control', {
            track: track.title,
            artist: track.artist.name,
            cover: track.albumThumbnail,
            isPlaying: true,
            dismissable: false,
            hasPrev: true,
            hasNext: true,
            hasClose: false,
            album: track.album,
            duration: track.duration,
            elapsed: 0,
            ticker: track.title,
            playIcon: 'media_play',
            pauseIcon: 'media_pause',
            prevIcon: 'media_prev',
            nextIcon: 'media_next',
            closeIcon: 'media_close',
            notificationIcon: 'notification'
        });
        this.musicControls.create({
            track: track.title,
            artist: track.artist.name,
            cover: 'http://i0.kym-cdn.com/photos/images/newsfeed/000/823/942/b1d.png', // IMAGE NOT FOUND == NO MUSIC CONTROLS SHOWN !!
            isPlaying: true,
            dismissable: false,
            hasPrev: true,
            hasNext: true,
            hasClose: false,
            album: track.album,
            duration: track.duration,
            elapsed: 0,
            ticker: track.title,
            playIcon: 'media_play',
            pauseIcon: 'media_pause',
            prevIcon: 'media_prev',
            nextIcon: 'media_next',
            closeIcon: 'media_close',
            notificationIcon: 'notification'
        });
    }

    subscribeToControl() {
        this.musicControls.subscribe().subscribe(action => {
            const message = JSON.parse(action).message;
            console.log('[MUSIC_CONTROL] action', action);
            switch (message) {
                case 'music-controls-next':
                    this.player.next();
                    break;
                case 'music-controls-previous':
                    this.player.previous();
                    break;
                case 'music-controls-pause':
                    this.player.pause();
                    break;
                case 'music-controls-play':
                    this.player.play();
                    break;
                default:
                    break;
            }
        });
    }
}