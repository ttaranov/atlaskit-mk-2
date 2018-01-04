import PeopleSearchProvider, {
  SearchResult,
  GraphqlResponse,
} from '../src/api/PeopleSearchProvider';
import * as fetchMock from 'fetch-mock';

function apiWillReturn(state: SearchResult[] | GraphqlResponse) {
  const response = Array.isArray(state)
    ? { data: { AccountCentricUserSearch: state } }
    : state;

  const opts = {
    name: 'people',
  };

  fetchMock.post('localhost/graphql', response, opts);
}

describe('PeopleSearchProvider', () => {
  let searchProvider;

  beforeEach(() => {
    searchProvider = new PeopleSearchProvider('localhost', '123');
  });

  afterEach(fetchMock.restore);

  describe('search()', () => {
    it('should put cloudId and search query into the graphql query', () => {
      apiWillReturn([]);
      searchProvider.search('query');

      const call = fetchMock.calls('people')[0];
      const body = JSON.parse(call[1].body);

      expect(body.variables.cloudId).toEqual('123');
      expect(body.variables.displayName).toEqual('query');
    });

    it('should return result items', async () => {
      apiWillReturn([
        {
          id: '123',
          fullName: 'fullName',
          avatarUrl: 'avatarUrl',
        },
      ]);

      const items = await searchProvider.search('query');
      expect(items).toHaveLength(1);

      const item = items[0];
      expect(item.type).toEqual('person');
      expect(item.resultId).toEqual('people-123');
      expect(item.avatarUrl).toEqual('avatarUrl');
      expect(item.name).toEqual('fullName');
      expect(item.href).toEqual('/home/people/123');
      expect(item.containerName).toBeUndefined();
    });

    it('should throw when data.AccountCentricUserSearch is not defined', async () => {
      apiWillReturn({
        data: 'foo',
      } as GraphqlResponse);

      expect.assertions(1);
      try {
        await searchProvider.search('query');
      } catch (e) {
        expect(e.message).toEqual(
          'PeopleSearchProvider: Response data missing',
        );
      }
    });

    it('should throw when data.errors is defined', async () => {
      apiWillReturn({
        errors: [
          {
            message: 'error1',
            category: 'category',
          },
        ],
      });

      expect.assertions(1);
      try {
        await searchProvider.search('query');
      } catch (e) {
        expect(e.message).toEqual('category: error1');
      }
    });
  });
});
