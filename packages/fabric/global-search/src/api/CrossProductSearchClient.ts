import { Result, ResultType } from '../model/Result';
import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';

export enum Scope {
  ConfluencePageBlog = 'confluence.page,blogpost',
  JiraIssue = 'jira.issue',
}

export interface CrossProductResults {
  jira: Result[];
  confluence: Result[];
}

export interface CrossProductSearchResponse {
  scopes: ScopeResult[];
}

export interface JiraItem {
  key: string;
  fields: {
    summary: string;
    project: {
      name: string;
    };
    issuetype: {
      iconUrl: string;
    };
  };
}

export interface ConfluenceItem {
  title: string;
  baseUrl: string;
  url: string;
  iconCssClass: string;
  container: {
    title: string;
  };
}

export type SearchItem = ConfluenceItem | JiraItem;

export interface ScopeResult {
  id: Scope;
  error?: string;
  results: SearchItem[];
}

export interface CrossProductSearchClient {
  search(query: string): Promise<CrossProductResults>;
}

export default class CrossProductSearchClientImpl
  implements CrossProductSearchClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  public async search(query: string): Promise<CrossProductResults> {
    const response = await this.makeRequest(query);

    return this.parseResponse(response);
  }

  private async makeRequest(
    query: string,
  ): Promise<CrossProductSearchResponse> {
    const body = {
      query: query,
      cloudId: this.cloudId,
      limit: 5,
      scopes: [Scope.JiraIssue, Scope.ConfluencePageBlog],
    };

    const options: RequestServiceOptions = {
      path: 'quicksearch/v1',
      requestInit: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    };

    return utils.requestService<CrossProductSearchResponse>(
      this.serviceConfig,
      options,
    );
  }

  private parseResponse(
    response: CrossProductSearchResponse,
  ): CrossProductResults {
    let jiraResults: Result[] = [];
    let confResults: Result[] = [];

    response.scopes.forEach(scope => {
      if (scope.id === Scope.ConfluencePageBlog) {
        confResults = scope.results.map(confluenceItemToResult);
      } else if (scope.id === Scope.JiraIssue) {
        jiraResults = scope.results.map(jiraItemToResult);
      } else {
        throw new Error('Unknown scope id: ' + scope.id);
      }
    });

    return {
      jira: jiraResults,
      confluence: confResults,
    };
  }
}

// TODO need real icons
export function getConfluenceAvatarUrl(iconCssClass: string) {
  if (iconCssClass.indexOf('blogpost') > -1) {
    return 'https://home.useast.atlassian.io/confluence-blogpost-icon.svg';
  } else {
    return 'https://home.useast.atlassian.io/confluence-page-icon.svg';
  }
}

export function removeHighlightTags(text: string) {
  return text.replace(/@@@hl@@@|@@@endhl@@@/g, '');
}

function confluenceItemToResult(item: ConfluenceItem): Result {
  return {
    type: ResultType.Object,
    resultId: 'search-' + item.url,
    avatarUrl: getConfluenceAvatarUrl(item.iconCssClass),
    name: removeHighlightTags(item.title),
    href: item.baseUrl + item.url,
    containerName: item.container.title,
  };
}

function jiraItemToResult(item: JiraItem): Result {
  return {
    type: ResultType.Object,
    resultId: 'search-' + item.key,
    avatarUrl: item.fields.issuetype.iconUrl,
    name: item.fields.summary,
    href: '/browse/' + item.key,
    containerName: item.fields.project.name,
  };
}
