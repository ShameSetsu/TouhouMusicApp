import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { AlbumOutDto } from '../../models/albumOutDto';
import { AlbumTrackOutDto } from '../../models/trackOutDto';
import { MusicService } from '../../services/music.service';
import { MusicPlayer } from '../../services/musicPlayer.service';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    music;
    albums: Array<AlbumOutDto>;
    tracks: Array<AlbumTrackOutDto>;
    searchSubject: Subject<string>;
    searchInput: FormControl;

    constructor(private musicService: MusicService, private musicPlayer: MusicPlayer, private platform: Platform) { }

    ngOnInit() {
        this.searchInput = new FormControl(null);
        this.searchInput.valueChanges
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(search => {
                console.log('search', search);
                this.musicService.getTracks({ page: 0, title: search }).subscribe((res: any) => {
                    this.tracks = res;
                    console.log('this.tracks', this.tracks);
                });
            });
    }

    playAll() {
        this.musicPlayer.startPlaylist(this.tracks);
    }

    playAtRandom() {
        this.musicPlayer.startRandom();
    }

    playMedia(track: AlbumTrackOutDto) {
        console.log('playTrack', track);
        this.musicPlayer.startPlaylist(this.tracks, { position: this.tracks.findIndex(value => this.findTrack(value, track)) });
    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            console.log('ready');
            this.musicService.getTracks({ page: 0 }).subscribe((res: any) => {
                this.tracks = res;
                console.log('this.tracks', this.tracks);
            });
        });
    }

    pauseMedia() {
        this.musicPlayer.pause();
    }

    findTrack(track: AlbumTrackOutDto, currentTrack: AlbumTrackOutDto): boolean {
        return (track._id == currentTrack._id);
    }
}
