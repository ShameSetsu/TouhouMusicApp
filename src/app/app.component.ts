import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { HomePage } from '../pages/home/home';
import { MusicControlsService } from '../services/musicControls.service';

@Component({
    templateUrl: 'app.html'
})
export class MyApp {
    rootPage: any = HomePage;
    trackFooterOpen: boolean = false;

    constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, orientation: ScreenOrientation, musicControls: MusicControlsService) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            // orientation.lock(orientation.ORIENTATIONS.PORTRAIT); // DISABLED FOR BROWSER
            splashScreen.hide();
        });
    }

    openTrackFooter(value: boolean){
        console.log('openTrackFooter', value);
        this.trackFooterOpen = value;
    }
}