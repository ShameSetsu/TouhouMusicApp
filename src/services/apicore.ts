import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

@Injectable()
export class ApiCore {
    url: string = 'http://192.168.1.24:3000/api/';

    constructor(private http: Http) { }

    get(endpoint: string, reqOpts?: any) {
        let headers = new Headers();

        let options = new RequestOptions({ headers: headers });
        console.log('[GET]', this.url + endpoint, options);
        return this.http.get(this.url + endpoint, options);
    }
}