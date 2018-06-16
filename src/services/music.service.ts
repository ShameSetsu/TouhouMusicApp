import { Injectable } from "@angular/core";
import { ApiCore } from "./apicore";


@Injectable()
export class MusicService {

    constructor(public api: ApiCore){}

    getAlbumTest(){
        return this.api.get('album/test').do(res=>{
            console.log('getTestMusic', res);
        }, err=>{
            console.error('getTestMusic', err);
        }).map((res: any)=>JSON.parse(res._body));
    }
}