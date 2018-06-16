import { Injectable } from "@angular/core";
import { Http, RequestOptionsArgs, RequestOptions, Headers } from '@angular/http';

@Injectable()
export class ApiCore {
    // url: string = 'localhost:3000/';
    url: string = 'http://192.168.1.24:3000/api/';

    constructor(private http: Http) {}

    get(endpoint: string, reqOpts?: any) {
        let headers = new Headers();
        // headers.append('Allow-Control-Allow-Origin', '*');
        // headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        // headers.append('Accept','application/json');
        // headers.append('content-type','application/json');
        
        let options = new RequestOptions({ headers: headers });
        console.log('[GET]', this.url + endpoint, options);
        return this.http.get(this.url + endpoint, options);
    }

    // downloadFile(endpoint){
    //     return this.http
    // }
}