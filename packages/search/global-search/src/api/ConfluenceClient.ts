import {
  ClientResult,
  ClientResultType,
  ClientResultContentType,
} from '../model/ClientResult';
import {
  RequestServiceOptions,
  utils,
  ServiceConfig,
} from '@atlaskit/util-service-support';

const RECENT_ITEMS_PATH: string =
  '/wiki/rest/recentlyviewed/1.0/recent?limit=10';
const RECENT_SPACE_PATH: string =
  'wiki/rest/recentlyviewed/1.0/recent/spaces?limit=5';

export interface ConfluenceClient {
  getRecentItems(): Promise<ClientResult[]>;
  getRecentSpaces(): Promise<ClientResult[]>;
}

export interface RecentPage {
  available: boolean;
  contentType: ClientResultContentType;
  id: string;
  lastSeen: number;
  space: string;
  spaceKey: string;
  title: string;
  type: string;
  url: string;
}

export interface RecentSpace {
  id: string;
  key: string;
  icon: string;
  name: string;
}

export default class ConfluenceClientImpl implements ConfluenceClient {
  // @ts-ignore TODO ignore unused for now
  private serviceConfig: ServiceConfig;
  // @ts-ignore TODO ignore unused for now
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  public async getRecentItems(): Promise<ClientResult[]> {
    const recentPages = await this.createRecentRequestPromise<RecentPage>(
      RECENT_ITEMS_PATH,
    );
    return recentPages.map(recentItemToResult);
  }

  public async getRecentSpaces(): Promise<ClientResult[]> {
    const recentSpaces = await this.createRecentRequestPromise<RecentSpace>(
      RECENT_SPACE_PATH,
    );
    return recentSpaces.map(recentSpaceToResult);
  }

  private createRecentRequestPromise<T>(path: string): Promise<Array<T>> {
    const options: RequestServiceOptions = {
      path: path,
      queryParams: {
        cloudId: this.cloudId,
      },
    };

    return utils.requestService(this.serviceConfig, options);
  }
}

function recentItemToResult(recentPage: RecentPage): ClientResult {
  return {
    resultId: recentPage.id,
    type: ClientResultType.Object,
    name: recentPage.title,
    href: recentPage.url,
    containerName: recentPage.space,
    contentType: recentPage.contentType,
  };
}

function recentSpaceToResult(recentSpace: RecentSpace): ClientResult {
  return {
    resultId: recentSpace.id,
    type: ClientResultType.Object,
    name: recentSpace.name,
    href: `/wiki/${recentSpace.key}/overview`,
    avatarUrl: recentSpace.icon,
    contentType: ClientResultContentType.Space,
  };
}
