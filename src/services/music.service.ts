import { Injectable } from '@angular/core';

import { ApiCore } from './apicore';
import { TrackQueryParameters } from '../models/trackQueryParameters';

@Injectable()
export class MusicService {

    constructor(public api: ApiCore) { }

    getAllAlbum() {
        return this.api.get('album/all').do(res => {
            console.log('getAllAlbum', res);
        }, err => {
            console.error('getAllAlbum', err);
        }).map((res: any) => JSON.parse(res._body));
    }

    getTracks(payload: TrackQueryParameters) {
        let endpoint = 'track';

        endpoint += '?page=' + payload.page;
        if(payload.album) endpoint += '&album=' + payload.album;
        if(payload.artist) endpoint += '&artist=' + payload.artist;
        if(payload.genre) endpoint += '&genre=' + payload.genre;
        if(payload.sort) endpoint += '&sort=' + payload.sort;
        if(payload.title) endpoint += '&title=' + payload.title;

        return this.api.get(endpoint).do(res => {
            console.log('getAllTracks', res);
        }, err => {
            console.error('getAllTracks', err);
        }).map((res: any) => JSON.parse(res._body));
    }

    getRandomTracks(){
        return this.api.get('track/random').do(res => {
            console.log('getAllTracks', res);
        }, err => {
            console.error('getAllTracks', err);
        }).map((res: any) => JSON.parse(res._body));
    }
}