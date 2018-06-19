import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { AlbumOutDto } from '../../models/albumOutDto';
import { AlbumTrackOutDto } from '../../models/trackOutDto';
import { MusicService } from '../../services/music.service';
import { MusicPlayer } from '../../services/musicPlayer.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    music;
    albums: Array<AlbumOutDto>;
    tracks: Array<AlbumTrackOutDto>;

    constructor(private musicService: MusicService, private musicPlayer: MusicPlayer, private platform: Platform) {

    }

    playAll(){
        this.musicPlayer.startPlaylist(this.tracks);
    }

    playMedia(track: AlbumTrackOutDto){
        console.log('playTrack', track);
        this.musicPlayer.startSingleTrack(track);
    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            console.log('ready');
            this.musicService.getAllTracks().subscribe((res: any) => {
                this.tracks = res;
                console.log('this.tracks', this.tracks);
            });
        });
    }

    pauseMedia() {
        this.musicPlayer.pause();
    }
}
