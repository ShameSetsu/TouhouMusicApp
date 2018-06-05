import { Injectable } from "@angular/core";
import { ApiCore } from "./apicore";


@Injectable()
export class MusicService {

    constructor(public api: ApiCore){}

    getTestMusic(fileName: String) {
        const endpoint = 'test/music';
        return this.api.get(endpoint).do(res=>{
            console.log('getTestMusic', res);
        }, err=>{
            console.error('getTestMusic', err);
        }).map((res: any)=>JSON.parse(res._body))
    }
}