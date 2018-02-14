import { Result, ResultType } from '../model/Result';
import makeRequest from './makeRequest';

export interface RecentItemsResponse {
  data: RecentItem[];
}

export interface RecentItem {
  objectId: string;
  name: string;
  iconUrl: string;
  container: string;
  url: string;
}

export interface RecentSearchClient {
  getRecentItems(): Promise<Result[]>;
  search(query: string): Promise<Result[]>;
}

export default class RecentSearchClientImpl implements RecentSearchClient {
  private url: string;
  private cloudId: string;
  private getRecentRequestPromise: Promise<RecentItemsResponse>;

  constructor(url: string, cloudId: string) {
    this.url = url;
    this.cloudId = cloudId;
  }

  public async getRecentItems(): Promise<Result[]> {
    const recentItems = await this.fetchRecentItems();
    return recentItems.map(recentItemToResult);
  }

  public async search(query: string): Promise<Result[]> {
    const recentItems = await this.fetchRecentItems();
    const filteredRecentItems = this.filterItems(recentItems, query);

    return filteredRecentItems.map(recentItemToResult);
  }

  private filterItems(items: RecentItem[], query: string): RecentItem[] {
    if (query.length === 0) {
      return [];
    }

    query = query.toLowerCase();
    return items.filter(item => {
      return item.name.toLowerCase().indexOf(query) > -1;
    });
  }

  private async fetchRecentItems(): Promise<RecentItem[]> {
    if (!this.getRecentRequestPromise) {
      this.getRecentRequestPromise = makeRequest(
        this.url,
        `/api/client/recent?cloudId=${this.cloudId}`,
      );
    }

    const response = await this.getRecentRequestPromise;
    return response.data;
  }
}

function recentItemToResult(recentItem: RecentItem): Result {
  return {
    type: ResultType.Object,
    resultId: 'recent-' + recentItem.objectId,
    avatarUrl: recentItem.iconUrl,
    name: recentItem.name,
    href: recentItem.url,
    containerName: recentItem.container,
  };
}
