import { Component, Output, EventEmitter, NgZone } from "@angular/core";
import { MusicPlayer } from "../../services/musicPlayer.service";
import { AlbumTrackOutDto } from "../../models/trackOutDto";
import { Subscription } from "rxjs/Subscription";
import { Platform } from "ionic-angular";

@Component({
    selector: 'current-track-footer',
    templateUrl: 'current-track-footer.html'
})
export class CurrentTrackFooter {

    track: AlbumTrackOutDto;
    playing: boolean;
    @Output() open: EventEmitter<boolean> = new EventEmitter<boolean>();
    trackDuration: number = 0;
    currentTimer = 0;
    timerSubscription: Subscription;
    tmpTimer: number;
    disabledButton: boolean = false;

    constructor(private musicPlayer: MusicPlayer, platform: Platform, zone: NgZone) {
        this.musicPlayer.trackPlaying.subscribe((event: { playing: true, track: AlbumTrackOutDto }) => {
            if (event.track) {
                this.open.emit(true);
                this.track = event.track;
                this.playing = event.playing;
                this.trackDuration = event.track.duration * 1000;
            } else {
                this.open.emit(false);
                this.track = null;
                this.playing = false;
            }
        });
        this.timerSubscription = this.musicPlayer.trackTimer.subscribe(timer=>{
            zone.run(()=>this.currentTimer = timer >= 0 ? timer : 0); // IS THIS TO HEAVY ?
        });
    }

    tooglePlay() {
        this.playing ? this.musicPlayer.pause() : this.musicPlayer.startSingleTrack(this.track);
    }

    previousTrack() {
        this.musicPlayer.previous();
    }

    nextTrack() {
        this.disabledButton = true;
        this.musicPlayer.next()
            .then(()=>this.disabledButton = false);
    }

    durationChange(value){
        this.tmpTimer = value;
    }

    selectTimer(event: Event){
        event.preventDefault();
        this.timerSubscription.unsubscribe();
        setTimeout(() => {
            this.musicPlayer.setPosition(this.tmpTimer).then(()=>{
                this.timerSubscription = this.musicPlayer.trackTimer.skip(1).subscribe(timer=>{
                    this.currentTimer = timer;
                });
            });
        });
    }
}