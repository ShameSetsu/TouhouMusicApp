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

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        AlbumCard,
        TrackCard
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
        Media,
        MusicPlayer,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }
