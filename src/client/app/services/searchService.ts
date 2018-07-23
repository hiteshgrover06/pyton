
import { Injectable } from '@angular/core';
import { HttpInterceptor } from './httpInterceptor';
import { Observable } from 'rxjs/Observable';

const GoogleSearchEndPoint = `https://www.googleapis.com/customsearch/v1?key=AIzaSyDXkgpdHRfcx82Ojp8hCx_pbVHc61T21cY
&cx=017576662512468239146:omuauf_lfve&q={0}`;

const BingSearchEndPoint = `https://api.cognitive.microsoft.com/bingcustomsearch/v7.0/search?q={0}
&customconfig=3806081118&safesearch=Moderate&count=10&offset=0`;

@Injectable()
export class SearchEngineService {

    constructor(private httpInterceptor: HttpInterceptor) { }

    public GetGoogleResults = (queryText: string): Observable<any> => {
        const url = GoogleSearchEndPoint.replace('{0}', queryText);
        return this.httpInterceptor.get(url, null);
    }

    public GetBingResults = (queryText: string): Observable<any> => {
        const url = BingSearchEndPoint.replace('{0}', queryText);

        const headers = {
            'Ocp-Apim-Subscription-Key': 'd9cb2084769c43ae9f4e601227054358'
        };

        return this.httpInterceptor.get(url, headers);
    }
}
