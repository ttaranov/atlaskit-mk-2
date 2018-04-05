import { Result, ResultType } from '../model/Result';
import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';

export interface RecentItemsResponse {
  data: RecentItem[];
}

export interface RecentItem {
  objectId: string;
  name: string;
  iconUrl: string;
  container: string;
  url: string;
  provider: string;
}

export interface ConfluenceSearchClient {
  getRecentPages(): Promise<Result[]>;
  getRecentSpaces(): Promise<Result[]>;
}

// TODO impl properly
export default class ConfluenceSearchClientImpl
  implements ConfluenceSearchClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;
  private getRecentRequestPromise: Promise<RecentItemsResponse>;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  public async getRecentItems(): Promise<Result[]> {
    const recentItems = await this.fetchRecentItems();
    return recentItems.map(recentItemToResult);
  }

  private async fetchRecentItems(): Promise<RecentItem[]> {
    if (!this.getRecentRequestPromise) {
      const options: RequestServiceOptions = {
        path: 'api/client/recent',
        queryParams: {
          cloudId: this.cloudId,
        },
      };

      this.getRecentRequestPromise = utils.requestService(
        this.serviceConfig,
        options,
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
    name: name,
    href: recentItem.url,
    containerName: recentItem.container,
    objectKey: objectKey,
  };
}
