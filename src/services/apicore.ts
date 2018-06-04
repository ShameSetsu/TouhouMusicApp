import { Injectable } from "@angular/core";
import { Http, RequestOptionsArgs } from '@angular/http';

@Injectable()
export class ApiCore {
    url: string = 'localhost:3000/';
    // url: string = 'http://localhost:8100/api/';

    constructor(private http: Http) {}

    get(endpoint: string, reqOpts?: any) {
        console.log('[GET]', this.url + endpoint);
        return this.http.get(this.url + endpoint, reqOpts);
    }

    // downloadFile(endpoint){
    //     return this.http
    // }
}