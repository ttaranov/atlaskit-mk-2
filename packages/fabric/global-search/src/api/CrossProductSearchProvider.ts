import { Result, ResultType } from '../model/Result';
import makeRequest from './makeRequest';

export interface CrossProductResults {
  jira: Result[];
  confluence: Result[];
}

interface SearchItemsResponse {
  data: SearchItem[];
}

interface SearchItem {
  objectId: string;
  name: string;
  iconUrl: string;
  container: string;
  url: string;
  provider: string;
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
    const response: SearchItemsResponse = await makeRequest(
      this.url,
      `/api/search?q=${encodeURIComponent(query)}`,
    );

    const jiraResults: Result[] = [];
    const confResults: Result[] = [];

    response.data.forEach(searchItem => {
      const result = searchItemToResult(searchItem);
      if (searchItem.provider === 'jira') {
        jiraResults.push(result);
      }

      if (searchItem.provider === 'confluence') {
        confResults.push(result);
      }
    });

    return Promise.resolve({
      jira: jiraResults,
      confluence: confResults,
    });
  }
}

function searchItemToResult(searchItem: SearchItem): Result {
  return {
    type: ResultType.Object,
    resultId: 'search-' + searchItem.objectId,
    avatarUrl: searchItem.iconUrl,
    name: searchItem.name,
    href: searchItem.url,
    containerName: searchItem.container,
  };
}
