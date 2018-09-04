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
  Result,
  GenericResultMap,
} from '../model/Result';

const RECENT_ITEMS_PATH: string = '/rest/internal/2/productsearch/recent';
const SEARCH_PATH: string = 'rest/quicknavjira/1/search';

const flatMap = (arr: [][]) =>
  arr.reduce((arr, result) => [...arr, ...result], []);

export type RecentItemsCounts = {
  issues?: number;
  boards?: number;
  filters?: number;
  projects?: number;
};

export const DEFAULT_RECENT_ITEMS_COUNT: RecentItemsCounts = {
  issues: 10,
  boards: 3,
  projects: 3,
  filters: 3,
};

export type Avatar = {
  url: string;
  css?: string;
};

export interface JiraSearchResponse {
  scopes: Scope[];
}

export interface Scope {
  id: string;
  experimentId: string;
  results?: Entry[];
  error?: Error;
}

export interface Entry {
  id: string;
  name: string;
  url: string;
  attributes: Attributes;
}

export interface Attributes {
  '@type': 'issue' | 'board' | 'project' | 'filter';
  containerId?: string;
  containerName?: string;
  ownerId?: string;
  ownerName?: string;
  key?: string;
  issueTypeId?: string;
  issueTypeName?: string;
  projectType?: string;
  avatar?: Avatar;
}

export interface Error {
  message: string;
}

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
  ): Promise<JiraObjectResult[]>;

  /**
   * @param query string to search for
   * @param searchSessionId string unique for every session id
   * @returns a promise which resolve to search results
   */
  search(query: string, searchSessionId: string): Promise<GenericResultMap>;
}

enum JiraResponseGroup {
  Issues = 'quick-search-issues',
  Projects = 'quick-search-projects',
  Boards = 'quick-search-boards',
  Filters = 'quick-search-filters',
}

const JiraTypeToContentType = {
  issue: ContentType.JiraIssue,
  board: ContentType.JiraBoard,
  filter: ContentType.JiraFilter,
  project: ContentType.JiraProject,
};

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
  ): Promise<JiraObjectResult[]> {
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

  /**
   *
   * @param searchSessionId unique id for each session
   * @param query query to search jira for
   * @returns a promise resolve to jira results or an error
   */
  public async search(
    searchSessionId: string,
    query: string,
  ): Promise<GenericResultMap> {
    const options: RequestServiceOptions = {
      path: SEARCH_PATH,
      queryParams: {
        search_id: searchSessionId,
        query,
      },
    };
    const searchResults = await utils.requestService<JiraSearchResponse>(
      this.serviceConfig,
      options,
    );

    return this.jiraScopesToResults(searchResults.scopes);
  }

  private recentItemGroupToItems(group: JiraRecentItemGroup) {
    const { id, items } = group;
    return items.map(item => this.recentItemToResultItem(item, id));
  }
  private recentItemToResultItem(
    item: JiraRecentItem,
    jiraGroup: JiraResponseGroup,
  ): JiraObjectResult {
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

  private jiraScopesToResults(scopes: Scope[]): GenericResultMap {
    return flatMap(scopes
      .filter(scope => !scope.error && scope.results && scope.results.length)
      .map(this.scopeToResult) as [][]).reduce((acc, entry) => {
      const key = Object.keys(entry)[0];
      const value = entry[key];
      return Object.assign({}, acc, { [key]: (acc[key] || []).concat(value) });
    }, {});
  }

  private scopeToResult(scope: Scope): { [k: string]: Result }[] {
    return (scope.results as Entry[]).map(({ id, name, url, attributes }) => ({
      [attributes['@type']]: {
        resultId: id,
        name: name,
        href: url,
        resultType: ResultType.JiraObjectResult,
        containerId: attributes.containerId,
        analyticsType: AnalyticsType.ResultJira,
        ...extractSpecificAttributes(attributes),
        avatarUrl: attributes.avatar && attributes.avatar.url,
        contentType: JiraTypeToContentType[attributes['@type']],
        experimentId: scope.experimentId,
      },
    }));
  }
}

const extractSpecificAttributes = (attributes: Attributes) => {
  const type = attributes['@type'];
  switch (type) {
    case 'issue':
      return {
        objectKey: attributes.key,
        containerName: attributes.issueTypeName,
      };
    case 'board':
      return {
        objectKey: 'Board',
        containerName: attributes.containerName,
      };
    case 'filter':
      return {
        objectKey: 'Filter',
        containerName: attributes.ownerName,
      };
    case 'project':
      return {
        containerName: attributes.projectType,
      };
  }
  return null;
};
