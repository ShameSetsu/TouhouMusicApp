import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { Settings } from '../settings';

@Injectable()
export class ApiCore {
    url: string = Settings.ApiHost + ':' + Settings.ApiPort + '/api/';

    constructor(private http: Http) { }

    get(endpoint: string, reqOpts?: any) {
        let headers = new Headers();

        let options = new RequestOptions({ headers: headers });
        console.log('[GET]', this.url + endpoint, options);
        return this.http.get(this.url + endpoint, options);
    }
}