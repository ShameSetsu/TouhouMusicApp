import { Component, Output, EventEmitter } from "@angular/core";
import { MusicPlayer } from "../../services/musicPlayer.service";
import { AlbumTrackOutDto } from "../../models/trackOutDto";
import { Subscription } from "rxjs/Subscription";

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
    tmpTimer;

    constructor(private musicPlayer: MusicPlayer) {
        this.musicPlayer.trackPlaying.subscribe((event: { playing: true, track: AlbumTrackOutDto }) => {
            if (event.track) {
                this.open.emit(true);
                this.track = event.track;
                this.playing = event.playing;
                this.trackDuration = event.track.duration * 1000;
                console.log('this.trackDuration', this.trackDuration);
            } else {
                this.open.emit(false);
                this.track = null;
                this.playing = false;
            }
        });
        this.timerSubscription = this.musicPlayer.trackTimer.subscribe(timer=>{
            console.log('firstSub', timer);
            this.currentTimer = timer;
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

    durationChange(value){
        this.tmpTimer = value;
    }

    selectTimer(event: Event){
        event.preventDefault();
        console.log('selectTimer', event);
        this.timerSubscription.unsubscribe();
        setTimeout(() => {
            console.log('position', this.tmpTimer);
            this.musicPlayer.setPosition(this.tmpTimer).then(()=>{
                this.timerSubscription = this.musicPlayer.trackTimer.skip(1).subscribe(timer=>{
                    console.log('secondSub', timer);
                    this.currentTimer = timer;
                });
            });
        });
    }
}