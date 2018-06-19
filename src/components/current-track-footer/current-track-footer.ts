import { Component, Output, EventEmitter } from "@angular/core";
import { MusicPlayer } from "../../services/musicPlayer.service";
import { AlbumTrackOutDto } from "../../models/trackOutDto";

@Component({
    selector: 'current-track-footer',
    templateUrl: 'current-track-footer.html'
})
export class CurrentTrackFooter {

    track: AlbumTrackOutDto;
    playing: boolean;
    @Output() open: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(private musicPlayer: MusicPlayer) {
        this.musicPlayer.trackPlaying.subscribe((event: { playing: true, track: AlbumTrackOutDto }) => {
            if (event.track) {
                this.open.emit(true);
                this.track = event.track;
                this.playing = event.playing;
            } else {
                this.open.emit(false);
                this.track = null;
                this.playing = false;
            }
        });
    }

    tooglePlay() {
        this.playing ? this.musicPlayer.pause() : this.musicPlayer.startSingleTrack(this.track);
    }

    previousTrack() {
        this.musicPlayer.previous();
    }

    nextTrack() {
        this.musicPlayer.next();
    }
}