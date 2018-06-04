import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { MusicService } from '../../services/music.service';
import { NativeAudio } from '@ionic-native/native-audio';

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    music;

    constructor(private navCtrl: NavController, private musicService: MusicService, private nativeAudio: NativeAudio, private platform: Platform) {

    }

    ionViewDidLoad() {
        this.platform.ready().then(() => {
            console.log('ready');
            this.musicService.getTestMusic('001.mp3').subscribe(res => {
                console.log('res', res);
                this.nativeAudio.preloadSimple('uniqueKey1', <any>res).then(() => {
                    //this.nativeAudio.play('uniqueKey1');
                });
            });
        });
    }

    playMusic() {
        this.nativeAudio.play('uniqueKey1').then(res => console.log('play', res), err => console.error('play', err));
    }
}
