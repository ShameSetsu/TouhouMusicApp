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
                        this.createControl(state.track).then(res=>{
                            console.log('[MUSIC_CONTROL] created', res);
                            this.musicControls.listen();
                            this.subscribeToControl();
                        });
                    }
                } else {
                    if(this.musicControls) {
                        this.musicControls.destroy();
                    }
                }
            });
        });
    }

    createControl(track: AlbumTrackOutDto): Promise<any> {
        return this.musicControls.create({
            track: track.title,        // optional, default : ''
            artist: track.artist.name,                       // optional, default : ''
            cover: track.albumThumbnail,      // optional, default : nothing
            // cover can be a local path (use fullpath 'file:///storage/emulated/...', or only 'my_image.jpg' if my_image.jpg is in the www folder of your app)
            //           or a remote url ('http://...', 'https://...', 'ftp://...')
            isPlaying: true,                         // optional, default : true
            dismissable: false,                         // optional, default : false

            // hide previous/next/close buttons:
            hasPrev: true,      // show previous button, optional, default: true
            hasNext: true,      // show next button, optional, default: true
            hasClose: false,       // show close button, optional, default: false

            // iOS only, optional
            album: track.album,     // optional, default: ''
            duration: track.duration, // optional, default: 0
            elapsed: 0, // optional, default: 0
            // hasSkipForward: false,  // show skip forward button, optional, default: false
            // hasSkipBackward: false, // show skip backward button, optional, default: false
            // skipForwardInterval: 15, // display number for skip forward, optional, default: 0
            // skipBackwardInterval: 15, // display number for skip backward, optional, default: 0
            // hasScrubbing: false, // enable scrubbing from control center and lockscreen progress bar, optional

            // Android only, optional
            
            ticker: '演奏する: ' + track.title, // text displayed in the status bar when the notification (and the ticker) are updated, optional
            // All icons default to their built-in android equivalents
            playIcon: 'media_play', // The supplied drawable name, e.g. 'media_play', is the name of a drawable found under android/res/drawable* folders
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
                case 'music-controls-destroy':
                    // Do something
                    break;

                // Headset events (Android only)
                // All media button events are listed below
                case 'music-controls-media-button':
                    // Do something
                    break;
                case 'music-controls-headset-unplugged':
                    // Do something
                    break;
                case 'music-controls-headset-plugged':
                    // Do something
                    break;
                default:
                    break;
            }
        });
    }
}