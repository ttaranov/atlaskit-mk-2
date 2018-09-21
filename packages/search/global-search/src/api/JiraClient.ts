import {
  RequestServiceOptions,
  utils,
  ServiceConfig,
} from '@atlaskit/util-service-support';
import {
  ResultType,
  AnalyticsType,
  JiraResult,
  ContentType,
} from '../model/Result';

const RECENT_ITEMS_PATH: string = 'rest/internal/2/productsearch/recent';
export type RecentItemsCounts = {
  issues?: number;
  boards?: number;
  filters?: number;
  projects?: number;
};

export const DEFAULT_RECENT_ITEMS_COUNT: RecentItemsCounts = {
  issues: 8,
  boards: 2,
  projects: 2,
  filters: 2,
};

/**
 * Jira client to reterive recent items from jira
 */
export interface JiraClient {
  /**
   * @param searchSessionId string unique for every session id
   * @param recentItemCounts optional number of items to return for every recent
   * @returns a promise which resolves to recent items throws
   */
  getRecentItems(
    searchSessionId: string,
    recentItemCounts?: RecentItemsCounts,
  ): Promise<JiraResult[]>;
}

enum JiraResponseGroup {
  Issues = 'quick-search-issues',
  Projects = 'quick-search-projects',
  Boards = 'quick-search-boards',
  Filters = 'quick-search-filters',
}

const JiraResponseGroupToContentType = {
  [JiraResponseGroup.Issues]: ContentType.JiraIssue,
  [JiraResponseGroup.Boards]: ContentType.JiraBoard,
  [JiraResponseGroup.Filters]: ContentType.JiraFilter,
  [JiraResponseGroup.Projects]: ContentType.JiraProject,
};

type JiraRecentItemGroup = {
  id: JiraResponseGroup;
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

  // Unused, just to mute ts lint
  public getCloudId() {
    return this.cloudId;
  }

  /**
   *
   * @param searchSessionId unique id for each session
   * @param recentItemCounts number of items to return for every recent item type defaults to {@link #defaultRecentItemCounts}
   * @returns a promise resolved to recent items array throws if any error occurs in reqeust or if parsing or transforming response fails
   */
  public async getRecentItems(
    searchSessionId: string,
    recentItemCounts: RecentItemsCounts = DEFAULT_RECENT_ITEMS_COUNT,
  ): Promise<JiraResult[]> {
    const options: RequestServiceOptions = {
      path: RECENT_ITEMS_PATH,
      queryParams: {
        ...recentItemCounts,
        search_id: searchSessionId,
      },
    };
    const recentItems = await utils.requestService<JiraRecentItemGroup[]>(
      this.serviceConfig,
      options,
    );
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
    jiraGroup: JiraResponseGroup,
  ): JiraResult {
    return {
      resultType: ResultType.JiraObjectResult,
      resultId: item.id,
      name: item.title,
      href: item.url,
      analyticsType: AnalyticsType.RecentJira,
      avatarUrl: `${item.avatarUrl}`,
      contentType: JiraResponseGroupToContentType[jiraGroup],
      ...this.getTypeSpecificAttributes(item, jiraGroup),
    };
  }

  private getTypeSpecificAttributes(
    item: JiraRecentItem,
    jiraGroup: JiraResponseGroup,
  ): {
    objectKey?: string;
    containerName?: string;
  } {
    return {
      ...(jiraGroup === JiraResponseGroup.Filters
        ? { objectKey: 'Filters' }
        : null),
      containerName: item.metadata,
    };
  }
}
