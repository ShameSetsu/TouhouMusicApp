import { Injectable } from "@angular/core";
import { ApiCore } from "./apicore";


@Injectable()
export class MusicService {

    constructor(public api: ApiCore){}

    getTestMusic(fileName: String) {
        const endpoint = 'files/music/' + fileName;
        return this.api.get(endpoint).do(res=>{
            console.log('getTestMusic', res);
        }, err=>{
            console.error('getTestMusic', err);
        })
    }
}