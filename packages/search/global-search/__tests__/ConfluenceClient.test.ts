import ConfluenceClient, {
  RecentPage,
  RecentSpace,
  ConfluenceContentType,
} from '../src/api/ConfluenceClient';
import {
  AnalyticsType,
  GlobalSearchResultTypes,
  ObjectType,
} from '../src/model/Result';

import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';

const DUMMY_CONFLUENCE_HOST = 'http://localhost';
const DUMMY_CLOUD_ID = '123';

function buildMockPage(type: ConfluenceContentType): RecentPage {
  return {
    available: true,
    contentType: type,
    id: '123',
    lastSeen: 123,
    space: 'Search & Smarts',
    spaceKey: 'abc',
    title: 'Page title',
    type: 'page',
    url: '/content/123',
  };
}

const MOCK_SPACE = {
  id: '123',
  key: 'S&S',
  icon: 'icon',
  name: 'Search & Smarts',
};

function mockRecentlyViewedPages(pages: RecentPage[]) {
  fetchMock.get('begin:http://localhost/rest/recentlyviewed/1.0/recent', pages);
}

function mockRecentlyViewedSpaces(spaces: RecentSpace[]) {
  fetchMock.get(
    'begin:http://localhost/rest/recentlyviewed/1.0/recent/spaces',
    spaces,
  );
}

describe('ConfluenceClient', () => {
  let confluenceClient: ConfluenceClient;

  beforeEach(() => {
    confluenceClient = new ConfluenceClient(
      DUMMY_CONFLUENCE_HOST,
      DUMMY_CLOUD_ID,
    );
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('getRecentItems', () => {
    it('should return confluence items', async () => {
      const pages: RecentPage[] = [
        buildMockPage('page'),
        buildMockPage('blogpost'),
      ];

      mockRecentlyViewedPages(pages);

      const result = await confluenceClient.getRecentItems();

      expect(result).toEqual([
        {
          resultId: pages[0].id,
          name: pages[0].title,
          href: `${DUMMY_CONFLUENCE_HOST}${pages[0].url}`,
          containerName: pages[0].space,
          analyticsType: AnalyticsType.RecentConfluence,
          globalSearchResultType:
            GlobalSearchResultTypes.ConfluenceObjectResult,
          objectType: ObjectType.ConfluencePage,
        },
        {
          resultId: pages[1].id,
          name: pages[1].title,
          href: `${DUMMY_CONFLUENCE_HOST}${pages[1].url}`,
          containerName: pages[1].space,
          analyticsType: AnalyticsType.RecentConfluence,
          globalSearchResultType:
            GlobalSearchResultTypes.ConfluenceObjectResult,
          objectType: ObjectType.ConfluenceBlogpost,
        },
      ]);
    });

    it('should not break if no results are returned', async () => {
      mockRecentlyViewedPages([]);
      const result = await confluenceClient.getRecentItems();
      expect(result).toEqual([]);
    });
  });

  describe('getRecentSpaces', () => {
    it('should return confluence spaces', async () => {
      const spaces: RecentSpace[] = [MOCK_SPACE, MOCK_SPACE];

      mockRecentlyViewedSpaces(spaces);

      const result = await confluenceClient.getRecentSpaces();

      expect(result).toEqual([
        {
          resultId: MOCK_SPACE.id,
          name: MOCK_SPACE.name,
          href: `${DUMMY_CONFLUENCE_HOST}/spaces/${MOCK_SPACE.key}/overview`,
          avatarUrl: MOCK_SPACE.icon,
          analyticsType: AnalyticsType.RecentConfluence,
          globalSearchResultType:
            GlobalSearchResultTypes.GenericContainerResult,
          objectType: ObjectType.ConfluenceSpace,
        },
        {
          resultId: MOCK_SPACE.id,
          name: MOCK_SPACE.name,
          href: `${DUMMY_CONFLUENCE_HOST}/spaces/${MOCK_SPACE.key}/overview`,
          avatarUrl: MOCK_SPACE.icon,
          analyticsType: AnalyticsType.RecentConfluence,
          globalSearchResultType:
            GlobalSearchResultTypes.GenericContainerResult,
          objectType: ObjectType.ConfluenceSpace,
        },
      ]);
    });

    it('should not break if no spaces are returned', async () => {
      mockRecentlyViewedSpaces([]);
      const result = await confluenceClient.getRecentSpaces();
      expect(result).toEqual([]);
    });
  });
});
