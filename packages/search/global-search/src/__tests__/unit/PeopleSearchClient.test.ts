import PeopleSearchClient, {
  SearchResult,
  GraphqlResponse,
} from '../../api/PeopleSearchClient';
import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';
import { AnalyticsType, ResultType, PersonResult } from '../../model/Result';

function searchApiWillReturn(state: SearchResult[] | GraphqlResponse) {
  const response = Array.isArray(state)
    ? { data: { UserSearch: state } }
    : state;

  const opts = {
    name: 'people',
  };
  // @ts-ignore
  fetchMock.post('localhost/graphql', response, opts);
}

function recentPeopleApiWillReturn(state: SearchResult[] | GraphqlResponse) {
  const response = Array.isArray(state)
    ? { data: { Collaborators: state } }
    : state;

  const opts = {
    name: 'people',
  };
  // @ts-ignore
  fetchMock.post('localhost/graphql', response, opts);
}

describe('PeopleSearchClient', () => {
  let searchClient: PeopleSearchClient;

  beforeEach(() => {
    searchClient = new PeopleSearchClient('localhost', '123');
  });

  afterEach(fetchMock.restore);

  describe('search()', () => {
    it('should put cloudId and search query into the graphql query', () => {
      searchApiWillReturn([]);
      searchClient.search('query');

      const call = fetchMock.calls('people')[0];
      // @ts-ignore
      const body = JSON.parse(call[1].body);

      expect(body.variables.cloudId).toEqual('123');
      expect(body.variables.displayName).toEqual('query');
    });

    it('should return result items', async () => {
      searchApiWillReturn([
        {
          id: '123',
          fullName: 'fullName',
          avatarUrl: 'avatarUrl',
          department: 'department',
          title: 'abc',
          nickname: 'nickname',
        },
      ]);

      const items = await searchClient.search('query');
      expect(items).toHaveLength(1);

      const item = items[0] as PersonResult;

      expect(item.resultType).toEqual(ResultType.PersonResult);
      expect(item.mentionName).toEqual('nickname');
      expect(item.presenceMessage).toEqual('abc');
      expect(item.resultId).toEqual('people-123');
      expect(item.avatarUrl).toEqual('avatarUrl');
      expect(item.name).toEqual('fullName');
      expect(item.href).toEqual('/people/123');
      expect(item.analyticsType).toEqual(AnalyticsType.ResultPerson);
    });

    it('should throw when data.UserSearch is not defined', async () => {
      searchApiWillReturn({
        data: 'foo',
      } as GraphqlResponse);

      expect.assertions(1);
      try {
        await searchClient.search('query');
      } catch (e) {
        expect(e.message).toEqual('PeopleSearchClient: Response data missing');
      }
    });

    it('should throw when data.errors is defined', async () => {
      searchApiWillReturn({
        errors: [
          {
            message: 'error1',
            category: 'category',
          },
        ],
      });

      expect.assertions(1);
      try {
        await searchClient.search('query');
      } catch (e) {
        expect(e.message).toEqual('category: error1');
      }
    });
  });

  describe('getRecentPeople()', () => {
    it('should put cloudId into the graphql query', () => {
      recentPeopleApiWillReturn([]);
      searchClient.getRecentPeople();

      const call = fetchMock.calls('people')[0];
      // @ts-ignore
      const body = JSON.parse(call[1].body);

      expect(body.variables.cloudId).toEqual('123');
    });

    it('should return result items', async () => {
      recentPeopleApiWillReturn([
        {
          id: '123',
          fullName: 'fullName',
          avatarUrl: 'avatarUrl',
          department: 'department',
          title: 'abc',
          nickname: 'nickname',
        },
      ]);

      const items = await searchClient.getRecentPeople();
      expect(items).toHaveLength(1);

      const item = items[0] as PersonResult;

      expect(item.resultType).toEqual(ResultType.PersonResult);
      expect(item.mentionName).toEqual('nickname');
      expect(item.presenceMessage).toEqual('abc');
      expect(item.resultId).toEqual('people-123');
      expect(item.avatarUrl).toEqual('avatarUrl');
      expect(item.name).toEqual('fullName');
      expect(item.href).toEqual('/people/123');
      expect(item.analyticsType).toEqual(AnalyticsType.RecentPerson);
    });

    it('should return empty array when data.Collaborators is not defined', async () => {
      recentPeopleApiWillReturn({
        data: 'foo',
      } as GraphqlResponse);

      const items = await searchClient.getRecentPeople();
      expect(items).toEqual([]);
    });

    it('should return empty array when data.errors is defined', async () => {
      recentPeopleApiWillReturn({
        errors: [
          {
            message: 'error1',
            category: 'category',
          },
        ],
      });

      const items = await searchClient.getRecentPeople();
      expect(items).toEqual([]);
    });
  });
});
