import { Result } from '../model/Result';
import { ServiceConfig } from '@atlaskit/util-service-support';

const RECENT_PAGES_PATH: string =
  '/wiki/rest/recentlyviewed/1.0/recent?limit=10';
const RECENT_SPACE_PATH: string =
  'wiki/rest/recentlyviewed/1.0/recent/spaces?limit=5';

export interface ConfluenceClient {
  getRecentPages(): Promise<Result[]>;
  getRecentSpaces(): Promise<Result[]>;
}

export interface RecentPage {
  available: boolean;
  contentType: string;
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
  private recentPagesRequestPromise: Promise<RecentPage[]>;
  private recentSpacesRequestPromise: Promise<RecentSpace[]>;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  public async getRecentPages(): Promise<Result[]> {
    const recentPages = await this.fetchRecentPages();
    return recentPages.map(recentPageToResult);
  }

  public async getRecentSpaces(): Promise<Result[]> {
    const recentSpaces = await this.fetchRecentSpaces();
    return recentSpaces.map(recentSpaceToResult);
  }

  private async fetchRecentPages(): Promise<RecentPage[]> {
    if (!this.recentPagesRequestPromise) {
      this.recentPagesRequestPromise = this.createRecentRequestPromise<
        RecentPage
      >(RECENT_PAGES_PATH);
    }

    return await this.recentPagesRequestPromise;
  }

  private async fetchRecentSpaces(): Promise<RecentSpace[]> {
    if (!this.recentSpacesRequestPromise) {
      this.recentSpacesRequestPromise = this.createRecentRequestPromise<
        RecentSpace
      >(RECENT_SPACE_PATH);
    }

    return await this.recentSpacesRequestPromise;
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

function recentPageToResult(recentPage: RecentPage): Result {
  return {
    resultId: recentPage.id,
    type: ResultType.Object,
    name: recentPage.title,
    href: recentPage.url,
    avatarUrl: '',
    containerName: recentPage.space,
    objectKey: recentPage.id,
  };
}

function recentSpaceToResult(recentSpace: RecentSpace): Result {
  return {
    resultId: recentSpace.id,
    type: ResultType.Object,
    name: recentSpace.name,
    href: `/wiki/${recentSpace.key}/overview`,
    avatarUrl: recentSpace.icon,
  };
}
