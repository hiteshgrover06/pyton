
import { FORM_DIRECTIVES } from '@angular/common';
import { Component } from '@angular/core';
import { Response } from '@angular/http';

import * as Services from '../services/index';

const searchEngineTypeMetaData = [
  { id: 0, value: 'Google Search' },
  { id: 1, value: 'Bing Search' },
  { id: 2, value: 'Yahoo Search' }
];

const numberOfRecordsPerPage: number = 10;

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
  public errorMessage: string;
  public currentPage: number;

  constructor(private searchEngineService: Services.SearchEngineService) {
    this.searchEngineTypes = searchEngineTypeMetaData;
    this.selectedSearchEngine = searchEngineTypeMetaData[0];
    this.currentPage = 0;
  }

  public onSearchEngineChanged = (item: KeyValuePair, searchText: string) => {
    this.selectedSearchEngine = item;
    if (searchText) {
      this.Search(searchText);
    }
  }

  public OnNextClicked = (searchText: string) => {
    this.currentPage += 1;
    let nextPageOffset = this.currentPage * numberOfRecordsPerPage + 1;
    this.Search(searchText, nextPageOffset);
  }

  public OnPreviousClicked = (searchText: string) => {
    this.currentPage -= 1;
    let nextPageOffset = this.currentPage * numberOfRecordsPerPage + 1;
    this.Search(searchText, nextPageOffset);
  }

  public Search = (queryString: string, offset?: number) => {
    if (queryString.trim()) {

      this.searchCallCompleted = false;
      this.SearchData = null;
      this.errorMessage = '';
      if (!offset) {
        this.currentPage = 0;
      }
      switch (this.selectedSearchEngine.id) {
        case 0: this.fireSearch(this.searchEngineService.GetGoogleResults, queryString.trim(), offset);
          break;
        case 1: this.fireSearch(this.searchEngineService.GetBingResults, queryString.trim(), offset);
          break;

        default: this.fireSearch(this.searchEngineService.GetGoogleResults, queryString.trim(), offset);
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

  private fireSearch = (apiMethod: Function, queryString: string, offset: number) => {

    apiMethod(queryString, offset).subscribe(
      (response: Response) => { this.onSearchOk(response, queryString); },
      (error: Error) => { this.onSearchNok(error); }
    );

  }

  private onSearchOk = (response: Response, queryString: string) => {
    let data = response.json();
    let mappedResponse = data && this.mapResponse(data);

    if (response.status === 200 && mappedResponse) {
      this.SearchData = mappedResponse;
      this.logSearchStasticsInLocalStorage(this.SearchData, this.selectedSearchEngine.id, queryString);
      if (!mappedResponse.items || !mappedResponse.items.length) {
        this.errorMessage = 'Sorry, No results found matching that search text.';
      }
    } else {
      this.errorMessage = 'Sorry, No results found matching that search text.';
    }
    this.searchCallCompleted = true;
  }

  private onSearchNok = (error: any) => {
    this.errorMessage = 'Unable to process your request at the moment, sorry for the inconvenience.';
    console.log('error', error);
    this.searchCallCompleted = true;
  }

  private mapResponse = (response: any): SearchResult => {
    const data = response;

    switch (this.selectedSearchEngine.id) {
      case 0: return data;
      case 1: return this.mapBingSearchData(data);
      default: return data;
    }

  }

  private mapBingSearchData(data: any): SearchResult {
    const searchInformation: SearchInformation = {
      formattedTotalResults: data.webPages && data.webPages.totalEstimatedMatches,
      totalResults: data.webPages && data.webPages.totalEstimatedMatches,
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
