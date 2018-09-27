import RecentSearchClient, {
  RecentItem,
  splitIssueKeyAndName,
} from '../../api/RecentSearchClient';
import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';
import {
  JiraResult,
  AnalyticsType,
  ResultType,
  ConfluenceObjectResult,
  ContentType,
} from '../../model/Result';

function apiWillReturn(state: RecentItem[]) {
  const response = Array.isArray(state) ? { data: state } : state;

  const opts = {
    name: 'recent',
  };

  fetchMock.get(
    'localhost/api/client/recent?cloudId=123',
    response,
    opts as fetchMock.MockOptionsMethodGet,
  );
}

describe('RecentSearchClient', () => {
  let searchClient: RecentSearchClient;

  beforeEach(() => {
    searchClient = new RecentSearchClient('localhost', '123');
  });

  afterEach(fetchMock.restore);

  describe('getRecentItems()', () => {
    it('should return result items', async () => {
      apiWillReturn([
        {
          objectId: 'objectId',
          name: 'HOT-83341 name',
          iconUrl: 'iconUrl',
          container: 'container',
          url: 'url',
          provider: 'jira',
        },
      ]);

      const items = await searchClient.getRecentItems();
      expect(items).toHaveLength(1);

      const item = items[0] as JiraResult;
      expect(item.resultId).toEqual('recent-objectId');
      expect(item.avatarUrl).toEqual('iconUrl');
      expect(item.name).toEqual('name');
      expect(item.href).toEqual('url');
      expect(item.containerName).toEqual('container');
      expect(item.objectKey).toEqual('HOT-83341');
      expect(item.analyticsType).toEqual(AnalyticsType.RecentJira);
      expect(item.resultType).toEqual(ResultType.JiraObjectResult);
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
          provider: 'confluence',
        },
      ]);

      const items = await searchClient.search('name');
      expect(items).toHaveLength(1);

      const item = items[0] as ConfluenceObjectResult;
      expect(item.resultId).toEqual('recent-objectId');
      expect(item.avatarUrl).toEqual('iconUrl');
      expect(item.name).toEqual('name');
      expect(item.href).toEqual('url');
      expect(item.containerName).toEqual('container');
      expect(item.analyticsType).toEqual(AnalyticsType.RecentConfluence);
      expect(item.resultType).toEqual(ResultType.ConfluenceObjectResult);
      expect(item.contentType).toBe(ContentType.ConfluencePage);
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
          provider: 'provider',
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
          provider: 'provider',
        },
        {
          objectId: 'objectId2',
          name: 'name2',
          iconUrl: 'iconUrl2',
          container: 'container2',
          url: 'url2',
          provider: 'provider',
        },
      ]);

      const items = await searchClient.search('Nam');
      expect(items).toHaveLength(2);
      expect(items[0].name).toEqual('name');
      expect(items[1].name).toEqual('name2');
    });
  });

  describe('jira issue name and key split', () => {
    it('should extract the key at the beginning of the name', () => {
      const { name, objectKey } = splitIssueKeyAndName(
        'HOME-123 Fix Confluence',
      );
      expect(objectKey).toEqual('HOME-123');
      expect(name).toEqual('Fix Confluence');
    });

    it('should leave names without issues key alone', () => {
      const { name, objectKey } = splitIssueKeyAndName('Fix Jira');
      expect(objectKey).toEqual(undefined);
      expect(name).toEqual('Fix Jira');
    });

    it('should not match issues keys not at the beginning of the name', () => {
      const { name, objectKey } = splitIssueKeyAndName(
        'HOME-123 Duplicate of HOME-666',
      );
      expect(objectKey).toEqual('HOME-123');
      expect(name).toEqual('Duplicate of HOME-666');
    });

    it('should not split the name of confluence titles', async () => {
      apiWillReturn([
        {
          objectId:
            'ari:cloud:confluence:a436116f-02ce-4520-8fbb-7301462a1674:blogpost/297541448',
          name: 'HOT-83341 PIR - Lets get to the bottom of this!',
          iconUrl: 'iconUrl',
          container: 'container',
          url: 'url',
          provider: 'confluence',
        },
      ]);

      const items = await searchClient.getRecentItems();
      expect(items).toHaveLength(1);

      const item = items[0] as ConfluenceObjectResult;
      expect(item.name).toEqual(
        'HOT-83341 PIR - Lets get to the bottom of this!',
      );
      expect(item).not.toHaveProperty('objectKey');
      expect(item.resultType).toEqual(ResultType.ConfluenceObjectResult);
      expect(item.contentType).toBe(ContentType.ConfluenceBlogpost);
    });
  });
});
