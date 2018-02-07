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

export type SearchItem = ConfluenceItem;

export interface ConfluenceItem {
  title: string;
  url: string;
  iconCssClass: string;
  container: {
    title: string;
  };
}

export interface ScopeResult {
  id: Scope;
  error?: string;
  results: SearchItem[];
}

export interface CrossProductSearchProvider {
  search(query: string): Promise<CrossProductResults>;
}

export default class CrossProductSearchProviderImpl
  implements CrossProductSearchProvider {
  private url: string;
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.url = url;
    this.cloudId = cloudId;
  }

  public async search(query: string): Promise<CrossProductResults> {
    const body = {
      query: query,
      cloudId: this.cloudId,
      limit: 5,
      scopes: [Scope.JiraIssue, Scope.ConfluencePage],
    };

    const response: CrossProductSearchResponse = await makeRequest(
      this.url,
      '/quicksearch/v1',
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    );

    const jiraResults: Result[] = [];
    const confResults: Result[] = [];

    response.scopes.forEach(scope => {
      const results = scope.results.map(searchItemToResult);

      if (scope.id === Scope.ConfluencePage) {
        confResults.push(...results);
      } else if (scope.id === Scope.JiraIssue) {
        jiraResults.push(...results);
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

function searchItemToResult(searchItem: ConfluenceItem): Result {
  return {
    type: ResultType.Object,
    resultId: 'search-' + searchItem.url,
    avatarUrl: getConfluenceAvatarUrl(searchItem.iconCssClass),
    name: removeHighlightTags(searchItem.title),
    href: searchItem.url,
    containerName: searchItem.container.title,
  };
}
