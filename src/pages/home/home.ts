import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { MusicService } from '../../services/music.service';
import { NativeAudio } from '@ionic-native/native-audio';
import { MusicPlayer } from '../../services/musicPlayer.service';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    music;

    constructor(private navCtrl: NavController, private musicService: MusicService, private musicPlayer: MusicPlayer, private platform: Platform) {

    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            console.log('ready');
            this.musicService.getTestMusic('001.mp3').subscribe((res: any) => {
                this.musicPlayer.setTracks(res.files);
            });
        });
    }

    playMusic() {
        this.musicPlayer
            .play('001')
            .then(res => console.log('play', res))
            .catch(err => console.error('play', err));
    }

    pauseMusic() {
        this.musicPlayer.pause()
        .then(res => console.log('stop', res))
        .catch(err => console.error('stop', err));
    }
}
