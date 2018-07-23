
import { FORM_DIRECTIVES } from '@angular/common';
import { Component } from '@angular/core';

import * as Services from '../services/index';

const searchEngineTypeMetaData = [
  { id: 0, value: 'Google Search' },
  { id: 1, value: 'Bing Search' },
  { id: 2, value: 'Yahoo Search' }
];

/**
 * This class represents the lazy loaded HomeComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.css'],
  directives: [FORM_DIRECTIVES],
  providers: [Services.SearchEngineService]
})
export class HomeComponent {

  public SearchData: SearchResult;
  public SearchStatisticsData: { [searchEngine: string]: SearchResult[]; } = {};
  public selectedSearchEngine: KeyValuePair;
  public searchCallCompleted: Boolean;
  public searchEngineTypes: Array<KeyValuePair>;

  constructor(private searchEngineService: Services.SearchEngineService) {
    this.searchEngineTypes = searchEngineTypeMetaData;
    this.selectedSearchEngine = searchEngineTypeMetaData[0];
  }

  public onSearchEngineChanged = (item: KeyValuePair, searchText: string) => {
    this.selectedSearchEngine = item;
    if (searchText) {
      this.Search(searchText);
    }
  }

  public Search = (queryString: string) => {
    if (queryString.trim()) {

      this.searchCallCompleted = false;
      this.SearchData = null;

      switch (this.selectedSearchEngine.id) {
        case 0: this.fireSearch(this.searchEngineService.GetGoogleResults, queryString.trim());
          break;
        case 1: this.fireSearch(this.searchEngineService.GetBingResults, queryString.trim());
          break;

        default: this.fireSearch(this.searchEngineService.GetGoogleResults, queryString.trim());
          break;
      }
    }
  }

  public GetSelectedSearchEngineStats = () => {
    return this.SearchStatisticsData[this.selectedSearchEngine.id.toString()] || null;
  }

  public HasSearchResults = (): Boolean => {
    return this.searchCallCompleted && this.SearchData && this.SearchData.items && this.SearchData.items.length > 0;
  }


  private logSearchStasticsInLocalStorage = (searchResult: SearchResult,
    searchEngineType: number, searchText: string) => {
    const searchEngineKey = searchEngineType.toString();

    if (!this.SearchStatisticsData[searchEngineKey]) {
      this.SearchStatisticsData[searchEngineKey] = [];
    }
    this.SearchStatisticsData[searchEngineKey].push(Object.assign({}, searchResult,
      { searchText }, { browser: this.selectedSearchEngine.value }, { timeStamp: new Date().toUTCString() }));
  }

  private fireSearch = (apiMethod: Function, queryString: string) => {

    apiMethod(queryString).subscribe((response: Response) => {
      this.SearchData = this.mapResponse(response);
      this.logSearchStasticsInLocalStorage(this.SearchData, this.selectedSearchEngine.id, queryString);
      this.searchCallCompleted = true;
    }, (error: any) => {
      console.log('error', error);
      this.searchCallCompleted = true;
    });

  }

  private mapResponse = (response: any): SearchResult => {
    const data = response.json();

    switch (this.selectedSearchEngine.id) {
      case 0: return data;
      case 1: return this.mapBingSearchData(data);
      default: return data;
    }

  }

  private mapBingSearchData(data: any): SearchResult {
    const searchInformation: SearchInformation = {
      formattedTotalResults: data.webPages && data.webPages.totalEstimatedMatches
    };

    const items: Array<Item> = [];
    (data.webPages && data.webPages.value || []).forEach((value: any) => {
      items.push({
        kind: value,
        title: value.name,
        htmlTitle: value.value,
        link: value.url,
        displayLink: value.displayUrl,
        htmlSnippet: value.snippet,
        cacheId: value.id,
        formattedUrl: value.displayUrl,
        htmlFormattedUrl: value.url
      });
    });

    return { searchInformation, items };
  }

}
