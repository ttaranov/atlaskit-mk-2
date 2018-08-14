import {
  RequestServiceOptions,
  utils,
  ServiceConfig,
} from '@atlaskit/util-service-support';
import {
  ResultType,
  AnalyticsType,
  JiraObjectResult,
  ContentType,
} from '../model/Result';

const RECENT_ITEMS_PATH: string = '/rest/internal/2/productsearch/recent';
export type RecentItemsCounts = {
  issues?: number;
  boards?: number;
  filters?: number;
  projects?: number;
};

export interface JiraClient {
  getRecentItems(
    counts: RecentItemsCounts,
    searchSessionId: string,
  ): Promise<JiraObjectResult[]>;
}

enum JiraGroup {
  Issues = 'quick-search-issues',
  Projects = 'quick-search-projects',
  Boards = 'quick-search-boards',
  Filters = 'quick-search-filters',
}

const GroupToContentType = {
  [JiraGroup.Issues]: ContentType.JiraIssue,
  [JiraGroup.Boards]: ContentType.JiraBoard,
  [JiraGroup.Filters]: ContentType.JiraFilter,
  [JiraGroup.Projects]: ContentType.JiraProject,
};

type JiraRecentItemGroup = {
  id: JiraGroup;
  name: string;
  items: JiraRecentItem[];
};

type JiraRecentItem = {
  id: string;
  title: string;
  subtitle: string;
  metadata: string;
  avatarUrl: string;
  url: string;
};
export default class JiraClientImpl implements JiraClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  public async getRecentItems(
    counts: RecentItemsCounts,
    searchSessionId: string,
  ): Promise<JiraObjectResult[]> {
    const options: RequestServiceOptions = {
      path: RECENT_ITEMS_PATH,
      queryParams: {
        ...counts,
        search_id: searchSessionId,
      },
      requestInit: {
        mode: 'cors',
        credentials: 'omit',
      },
    };
    const recentItems = await utils.requestService<JiraRecentItemGroup[]>(
      {
        ...this.serviceConfig,
        securityProvider: () => ({ omitCredentials: true }),
      },
      options,
    );
    console.log(recentItems);
    return recentItems
      .map(group => this.recentItemGroupToItems(group))
      .reduce((acc, item) => [...acc, ...item], []);
  }

  private recentItemGroupToItems(group: JiraRecentItemGroup) {
    const { id, items } = group;
    return items.map(item => this.recentItemToResultItem(item, id));
  }
  private recentItemToResultItem(
    item: JiraRecentItem,
    jiraGroup: JiraGroup,
  ): JiraObjectResult {
    return {
      resultType: ResultType.JiraObjectResult,
      resultId: item.id,
      name: item.title,
      href: item.url,
      analyticsType: AnalyticsType.RecentJira,
      avatarUrl: `${item.avatarUrl}`,
      contentType: GroupToContentType[jiraGroup],
      ...this.getSpecificAttributes(item, jiraGroup),
    };
  }

  private getSpecificAttributes(
    item: JiraRecentItem,
    jiraGroup: JiraGroup,
  ): {
    objectKey?: string;
    containerName?: string;
  } {
    switch (jiraGroup) {
      case JiraGroup.Boards:
      case JiraGroup.Projects:
      case JiraGroup.Issues:
        return {
          containerName: item.metadata,
        };
      case JiraGroup.Filters:
        return {
          objectKey: 'Filter',
          containerName: item.metadata,
        };
    }
    return {};
  }
}
