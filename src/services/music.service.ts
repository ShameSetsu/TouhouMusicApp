import { Injectable } from '@angular/core';

import { ApiCore } from './apicore';

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

    getAllTracks() {
        return this.api.get('track/all').do(res => {
            console.log('getAllTracks', res);
        }, err => {
            console.error('getAllTracks', err);
        }).map((res: any) => JSON.parse(res._body));
    }
}