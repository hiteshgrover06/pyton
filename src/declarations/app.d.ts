
interface SearchResult {
    searchInformation: SearchInformation;
    items: Array<Item>;
    searchText?: string;
    browser?: string;
    timeStamp?: string;
}

interface SearchInformation {
    formattedSearchTime?: string;
    formattedTotalResults: string;
    searchTime?: number;
    totalResults?: string;
}

interface KeyValuePair {
    id: number;
    value: string;
}

interface Item {
    kind: string;
    title: string;
    htmlTitle: string;
    link: string;
    displayLink: string;
    htmlSnippet: string;
    cacheId: string;
    formattedUrl: string;
    htmlFormattedUrl: string;
    pagemap?: {
        metatags: { progid: string; originator: string }[]
    }
}
