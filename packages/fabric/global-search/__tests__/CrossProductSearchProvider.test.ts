import CrossProductSearchProvider, {
  SearchItem,
} from '../src/api/CrossProductSearchProvider';
import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';

function apiWillReturn(state: SearchItem[]) {
  const response = Array.isArray(state) ? { data: state } : state;

  const opts = {
    method: 'get',
    name: 'xpsearch',
  };

  fetchMock.mock('begin:localhost/api/search', response, opts);
}

describe('CrossProductSearchProvider', () => {
  let searchProvider;

  beforeEach(() => {
    searchProvider = new CrossProductSearchProvider('localhost', '123');
  });

  afterEach(fetchMock.restore);

  describe('search', () => {
    it('should return result items', async () => {
      apiWillReturn([
        {
          objectId: '123',
          name: 'name',
          iconUrl: 'iconUrl',
          container: 'container',
          url: 'url',
          provider: 'jira',
        },
      ]);

      const result = await searchProvider.search('query');
      expect(result.jira).toHaveLength(1);

      const item = result.jira[0];
      expect(item.type).toEqual('object');
      expect(item.resultId).toEqual('search-123');
      expect(item.avatarUrl).toEqual('iconUrl');
      expect(item.name).toEqual('name');
      expect(item.href).toEqual('url');
      expect(item.containerName).toEqual('container');
    });
  });
});
