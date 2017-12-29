import { Result, ResultType } from '../model/Result';

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

export default class CrossProductSearchProvider {
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

// TODO dedupe
async function makeRequest(url: string, path: string): Promise<any> {
  const fetchOptions: RequestInit = {
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(`${url}${path}`, fetchOptions);

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return await response.json();
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
