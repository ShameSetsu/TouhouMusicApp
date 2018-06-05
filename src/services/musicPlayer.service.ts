import { Injectable } from "@angular/core";
import { NativeAudio } from "@ionic-native/native-audio";

@Injectable()
export class MusicPlayer {

    currentPlaylist: Array<any>;

    //POC VAR
    track = 'http://localhost:3000/files/music/001.mp3';
    currentTrackId: string;

    constructor(private nativeAudio: NativeAudio) { }

    play(trackId: string): Promise<any> {
        this.currentTrackId = trackId;
        return this.nativeAudio.preloadSimple(this.currentTrackId, this.track).then(() => {
            return this.nativeAudio.play(this.currentTrackId)
        });
    }

    pause(): Promise<any> {
        return this.nativeAudio.stop(this.currentTrackId);
    }

    setTracks(tarcks: any) {
        return null;
    }
}