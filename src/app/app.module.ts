import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { Media } from '@ionic-native/media';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AlbumCard } from '../components/album-card/album-card';
import { HomePage } from '../pages/home/home';
import { ApiCore } from '../services/apicore';
import { MusicService } from '../services/music.service';
import { MusicPlayer } from '../services/musicPlayer.service';
import { MyApp } from './app.component';
import { TrackCard } from '../components/track-card/track-card';
import { CurrentTrackFooter } from '../components/current-track-footer/current-track-footer';
import { MsToTime } from '../services/msToTime.pipe';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { MusicControlsService } from '../services/musicControls.service';
import { MusicControls } from '@ionic-native/music-controls';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        AlbumCard,
        TrackCard,
        CurrentTrackFooter,
        MsToTime
    ],
    imports: [
        BrowserModule,
        IonicModule.forRoot(MyApp),
        HttpModule
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        MyApp,
        HomePage
    ],
    providers: [
        StatusBar,
        SplashScreen,
        ApiCore,
        MusicService,
        MusicControlsService,
        Media,
        ScreenOrientation,
        MusicControls,
        MusicPlayer,
        ScreenOrientation,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }
