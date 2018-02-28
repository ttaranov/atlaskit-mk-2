import RecentSearchClient, { RecentItem } from '../src/api/RecentSearchClient';
import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';

function apiWillReturn(state: RecentItem[]) {
  const response = Array.isArray(state) ? { data: state } : state;

  const opts = {
    name: 'recent',
  };

  fetchMock.get('localhost/api/client/recent?cloudId=123', response, opts);
}

describe('RecentSearchClient', () => {
  let searchClient;

  beforeEach(() => {
    searchClient = new RecentSearchClient('localhost', '123');
  });

  afterEach(fetchMock.restore);

  describe('getRecentItems()', () => {
    it('should return result items', async () => {
      apiWillReturn([
        {
          objectId: 'objectId',
          name: 'name',
          iconUrl: 'iconUrl',
          container: 'container',
          url: 'url',
        },
      ]);

      const items = await searchClient.getRecentItems();
      expect(items).toHaveLength(1);

      const item = items[0];
      expect(item.type).toEqual('object');
      expect(item.resultId).toEqual('recent-objectId');
      expect(item.avatarUrl).toEqual('iconUrl');
      expect(item.name).toEqual('name');
      expect(item.href).toEqual('url');
      expect(item.containerName).toEqual('container');
    });
  });

  describe('search()', () => {
    it('should return result items', async () => {
      apiWillReturn([
        {
          objectId: 'objectId',
          name: 'name',
          iconUrl: 'iconUrl',
          container: 'container',
          url: 'url',
        },
      ]);

      const items = await searchClient.search('name');
      expect(items).toHaveLength(1);

      const item = items[0];
      expect(item.type).toEqual('object');
      expect(item.resultId).toEqual('recent-objectId');
      expect(item.avatarUrl).toEqual('iconUrl');
      expect(item.name).toEqual('name');
      expect(item.href).toEqual('url');
      expect(item.containerName).toEqual('container');
    });

    it('should call the api only once when client is invoked repeatedly', async () => {
      apiWillReturn([]);

      await searchClient.search('once');
      await searchClient.search('twice');
      await searchClient.search('thrice');

      expect(fetchMock.calls('recent')).toHaveLength(1);
    });

    it('should return an empty array when query is empty', async () => {
      apiWillReturn([
        {
          objectId: 'objectId',
          name: 'name',
          iconUrl: 'iconUrl',
          container: 'container',
          url: 'url',
        },
      ]);

      const items = await searchClient.search('');
      expect(items).toHaveLength(0);
    });

    it('should filter by prefix search', async () => {
      apiWillReturn([
        {
          objectId: 'objectId',
          name: 'name',
          iconUrl: 'iconUrl',
          container: 'container',
          url: 'url',
        },
        {
          objectId: 'objectId2',
          name: 'name2',
          iconUrl: 'iconUrl2',
          container: 'container2',
          url: 'url2',
        },
      ]);

      const items = await searchClient.search('Nam');
      expect(items).toHaveLength(2);
      expect(items[0].name).toEqual('name');
      expect(items[1].name).toEqual('name2');
    });
  });
});
