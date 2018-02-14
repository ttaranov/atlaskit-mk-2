import { Result, ResultType } from '../model/Result';
import makeRequest from './makeRequest';

export enum Scope {
  ConfluencePage = 'confluence.page',
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
  };
}

export interface ConfluenceItem {
  title: string;
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
  private url: string;
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.url = url;
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
      scopes: [Scope.JiraIssue, Scope.ConfluencePage],
    };

    return await makeRequest(this.url, '/quicksearch/v1', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  private parseResponse(
    response: CrossProductSearchResponse,
  ): CrossProductResults {
    let jiraResults: Result[] = [];
    let confResults: Result[] = [];

    response.scopes.forEach(scope => {
      if (scope.id === Scope.ConfluencePage) {
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

function confluenceItemToResult(jiraItem: ConfluenceItem): Result {
  return {
    type: ResultType.Object,
    resultId: 'search-' + jiraItem.url,
    avatarUrl: getConfluenceAvatarUrl(jiraItem.iconCssClass),
    name: removeHighlightTags(jiraItem.title),
    href: jiraItem.url,
    containerName: jiraItem.container.title,
  };
}

function jiraItemToResult(jiraItem: JiraItem): Result {
  return {
    type: ResultType.Object,
    resultId: 'search-' + jiraItem.key + 'TODO',
    avatarUrl: 'TODO',
    name: jiraItem.fields.summary,
    href: 'TODO',
    containerName: jiraItem.key,
  };
}
