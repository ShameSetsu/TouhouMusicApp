import { Component } from "@angular/core";
import { MusicPlayer } from "../../services/musicPlayer.service";
import { AlbumTrackOutDto } from "../../models/trackOutDto";

@Component({
    selector: 'current-track-footer',
    templateUrl: 'current-track-footer.html'
})
export class CurrentTrackFooter {

    track: AlbumTrackOutDto;
    playing: boolean;

    constructor(private musicPlayer: MusicPlayer) {
        this.musicPlayer.trackPlaying.subscribe((event: { playing: true, track: AlbumTrackOutDto }) => {
            if (event) {
                this.track = event.track;
                this.playing = event.playing;
            } else {
                this.track = null;
                this.playing = false;
            }
        });
    }

    tooglePlay() {
        this.playing ? this.musicPlayer.pause() : this.musicPlayer.play(this.track);
    }
}