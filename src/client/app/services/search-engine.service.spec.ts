import { provide, ReflectiveInjector } from '@angular/core';
import { BaseRequestOptions, ConnectionBackend, Http, HTTP_PROVIDERS, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { Observable } from 'rxjs/Observable';

import { SearchEngineService } from './searchService';
import { HttpInterceptor } from '../services/httpInterceptor';

export function main() {
  describe('Search engine service', () => {
    let serachtServiceInstance: SearchEngineService;
    let backend: MockBackend;
    let initialResponse: any;

    beforeEach(() => {
      let injector = ReflectiveInjector.resolveAndCreate([
        HTTP_PROVIDERS,
        SearchEngineService,
        BaseRequestOptions,
        HttpInterceptor,
        MockBackend,
        provide(Http, {
          useFactory: function(backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
            return new Http(backend, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }),
      ]);
      serachtServiceInstance = injector.get(SearchEngineService);
      backend = injector.get(MockBackend);

      let connection: any;
      backend.connections.subscribe((c: any) => connection = c);
      initialResponse = serachtServiceInstance.GetGoogleResults('query');
      connection.mockRespond(new Response(new ResponseOptions({ body: '["Dijkstra", "Hopper"]' })));
    });

    it('should return an Observable when get called', () => {
      expect(initialResponse).toEqual(jasmine.any(Observable));
    });

    it('should resolve to list of searchItems when get called', () => {
      let responseData: any;
      initialResponse.subscribe((data: any) => responseData = data.json());
      expect(responseData).toEqual(['Dijkstra', 'Hopper']);
    });
  });
}
