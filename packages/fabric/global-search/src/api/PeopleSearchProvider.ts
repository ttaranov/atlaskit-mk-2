import { Result, ResultType } from '../model/Result';
import makeRequest from './makeRequest';

export interface GraphqlResponse {
  errors?: GraphqlError[];
  data?: {
    AccountCentricUserSearch?: SearchResult[];
  };
}

export interface SearchResult {
  id: string;
  avatarUrl: string;
  fullName: string;
}

export interface GraphqlError {
  category: string;
  message: string;
}

export interface PeopleSearchProvider {
  search(query: string): Promise<Result[]>;
}

export default class PeopleSearchProviderImpl implements PeopleSearchProvider {
  private url: string;
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.url = url;
    this.cloudId = cloudId;
  }

  private buildQuery(query: string) {
    return {
      query: `query Search(
        $cloudId: String!,
        $displayName: String!,
        $first: Int!,
        $offset: Int,
        $excludeInactive: Boolean,
        $excludeBots: Boolean
      ) {
        AccountCentricUserSearch (displayName: $displayName, cloudId: $cloudId, first: $first, offset: $offset,
        filter: { excludeInactive: $excludeInactive, excludeBots: $excludeBots }) {
          id,
          fullName,
          avatarUrl
        }
      }`,
      variables: {
        cloudId: this.cloudId,
        displayName: query,
        first: 5,
        offset: 1,
        excludeInactive: true,
        excludeBots: true,
      },
    };
  }

  public async search(query: string): Promise<Result[]> {
    const response: GraphqlResponse = await makeRequest(this.url, '/graphql', {
      method: 'POST',
      body: JSON.stringify(this.buildQuery(query)),
    });

    if (response.errors) {
      throw new Error(makeGraphqlErrorMessage(response.errors));
    }

    if (!response.data || !response.data.AccountCentricUserSearch) {
      throw new Error('PeopleSearchProvider: Response data missing');
    }

    return response.data.AccountCentricUserSearch.map(userSearchResultToResult);
  }
}

function makeGraphqlErrorMessage(errors: GraphqlError[]) {
  const firstError = errors[0];
  return `${firstError.category}: ${firstError.message}`;
}

function userSearchResultToResult(searchResult: SearchResult): Result {
  return {
    type: ResultType.Person,
    resultId: 'people-' + searchResult.id,
    name: searchResult.fullName,
    href: '/home/people/' + searchResult.id,
    avatarUrl: searchResult.avatarUrl,
  };
}
