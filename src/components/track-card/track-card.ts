import { Component, Input, Output, EventEmitter } from "@angular/core";
import { AlbumTrackOutDto } from "../../models/trackOutDto";
import { DomSanitizer } from "@angular/platform-browser";
import { MusicPlayer } from "../../services/musicPlayer.service";
import { Subscription } from "rxjs/Subscription";

@Component({
    selector: 'track-card',
    templateUrl: 'track-card.html'
})
export class TrackCard {
    @Input() track: AlbumTrackOutDto;
    @Output() play: EventEmitter<void> = new EventEmitter<void>();
    @Output() pause: EventEmitter<void> = new EventEmitter<void>();
    playerSubscription: Subscription;
    playing: boolean = false;

    constructor(private sanitizer: DomSanitizer, private musicPlayer: MusicPlayer){}

    ngOnInit(){
        this.playerSubscription = this.musicPlayer.trackPlaying.subscribe((event: {playing: true, track: AlbumTrackOutDto})=>{
            this.playing = (event && event.playing && event.track._id == this.track._id);
        });
    }

    ngOnDestroy(){
        this.playerSubscription.unsubscribe();
    }

    toogleTrack() {
        this.playing ? this.pause.emit() : this.play.emit();
    }

    sanitize(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}