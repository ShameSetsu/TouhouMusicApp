import { Injectable } from "@angular/core";
import { NativeAudio } from "@ionic-native/native-audio";

@Injectable()
export class MusicPlayer {

    currentPlaylist: Array<any>;

    //POC VAR
    currentTrackId: string;
    track;

    constructor(private nativeAudio: NativeAudio) { }

    play(trackId: string): Promise<any> {
        this.currentTrackId = this.track.file;
        console.log("play", this.track);
        console.log('trackUrl', 'http://192.168.1.24:3000/files/music/' + this.track.file + '.' + this.track.format);
        return this.nativeAudio.preloadComplex(this.currentTrackId, 'http://192.168.1.24:3000/files/music/' + this.track.file + '.' + this.track.format, 1,1,0).then(() => {
            return this.nativeAudio.play(this.currentTrackId)
        });
    }

    pause(): Promise<any> {
        return this.nativeAudio.stop(this.currentTrackId);
    }

    setTracks(track: any) {
        this.track = track;
    }
}