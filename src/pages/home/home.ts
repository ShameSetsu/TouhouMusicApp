import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

import { AlbumOutDto } from '../../models/albumOutDto';
import { AlbumTrackOutDto } from '../../models/trackOutDto';
import { MusicService } from '../../services/music.service';
import { MusicPlayer } from '../../services/musicPlayer.service';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    albums: Array<AlbumOutDto>;
    tracks: Array<AlbumTrackOutDto>;
    searchSubject: Subject<string>;
    searchInput: FormControl;
    loadingEnabled: boolean = true;
    trackPage: number = 1;

    constructor(private musicService: MusicService, private musicPlayer: MusicPlayer, private platform: Platform) { }

    ngOnInit() {
        this.searchInput = new FormControl(null);
        this.searchInput.valueChanges
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(search => {
                console.log('search', search);
                this.musicService.getTracks({ page: 1, title: search }).subscribe((res: any) => {
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
            this.musicService.getTracks({ page: 1 }).subscribe((res: any) => {
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

    getNextPage(): Promise<any> {
        this.trackPage++;
        console.log('getNextPage');
        return this.musicService.getTracks({ page: this.trackPage, title: this.searchInput.value })
            .map(tracks => {
                console.log('add', tracks);
                console.log('tracks.length', tracks.length)
                if(tracks.length < 8) this.loadingEnabled = false;
                tracks.forEach(track => {
                    this.tracks.push(track);
                });
            }).toPromise();
    }
}
