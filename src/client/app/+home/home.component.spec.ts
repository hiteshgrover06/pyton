import { Component, provide } from '@angular/core';
import { TestComponentBuilder } from '@angular/compiler/testing';
import {
  describe,
  expect,
  inject,
  it
} from '@angular/core/testing';
import {
  BaseRequestOptions,
  ConnectionBackend,
  Http,
  HTTP_PROVIDERS
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import * as Services from '../services/index';
import { HomeComponent } from './home.component';

export function main() {
  describe('Home component', () => {
    it('should work',
      inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.createAsync(TestComponent)
          .then((rootTC: any) => {
            rootTC.detectChanges();

            let homeInstance = <HomeComponent>rootTC.debugElement.children[0].componentInstance;

            expect(homeInstance.searchEngineTypes.length).toEqual(3);
            expect(homeInstance.selectedSearchEngine).toEqual('0');
          });
      }));

    it('onSearchEngineChanged -- should update the selectedSearchEngine ',
      inject([TestComponentBuilder], (tcb: TestComponentBuilder) => {
        tcb.createAsync(TestComponent)
          .then((rootTC: any) => {
            rootTC.detectChanges();

            let homeInstance = <HomeComponent>rootTC.debugElement.children[0].componentInstance;

            expect(homeInstance.selectedSearchEngine).toEqual('0');

            homeInstance.onSearchEngineChanged(homeInstance.searchEngineTypes[1], '');

            expect(homeInstance.selectedSearchEngine).toEqual('1');
          });
      }));
  });
}

@Component({
  providers: [
    HTTP_PROVIDERS,
    Services.HttpInterceptor,
    Services.SearchEngineService,
    BaseRequestOptions,
    MockBackend,
    provide(Http, {
      useFactory: function (backend: ConnectionBackend, defaultOptions: BaseRequestOptions) {
        return new Http(backend, defaultOptions);
      },
      deps: [MockBackend, BaseRequestOptions]
    }),
  ],
  selector: 'test-cmp',
  template: '<sd-home></sd-home>',
  directives: [HomeComponent]
})
class TestComponent { }
