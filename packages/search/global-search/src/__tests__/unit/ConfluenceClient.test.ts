import ConfluenceClient, {
  RecentPage,
  RecentSpace,
  ConfluenceContentType,
  QuickNavResponse,
  QuickNavResult,
} from '../../api/ConfluenceClient';
import {
  AnalyticsType,
  ResultType,
  ContentType,
  ContainerResult,
  PersonResult,
} from '../../model/Result';

import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';

const DUMMY_CONFLUENCE_HOST = 'http://localhost';
const DUMMY_CLOUD_ID = '123';
const PAGE_CLASSNAME = 'content-type-page';
const BLOG_CLASSNAME = 'content-type-blogpost';
const SPACE_CLASSNAME = 'content-type-space';
const PEOPLE_CLASSNAME = 'content-type-userinfo';

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
    iconClass: 'iconClass',
  };
}

const MOCK_SPACE = {
  id: '123',
  key: 'S&S',
  icon: 'icon',
  name: 'Search & Smarts',
};

const MOCK_QUICKNAV_RESULT_BASE = {
  href: '/href',
  name: 'name',
  id: '123',
  icon: 'icon',
};

const mockQuickNavResult = (className: string) => ({
  className: className,
  ...MOCK_QUICKNAV_RESULT_BASE,
});

function mockRecentlyViewedPages(pages: RecentPage[]) {
  fetchMock.get('begin:http://localhost/rest/recentlyviewed/1.0/recent', pages);
}

function mockRecentlyViewedSpaces(spaces: RecentSpace[]) {
  fetchMock.get(
    'begin:http://localhost/rest/recentlyviewed/1.0/recent/spaces',
    spaces,
  );
}

function mockQuickNavSearch(results: QuickNavResult[][]) {
  fetchMock.get('begin:http://localhost/rest/quicknav/1', {
    contentNameMatches: results,
  } as QuickNavResponse);
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

      const result = await confluenceClient.getRecentItems('search_id');

      expect(result).toEqual([
        {
          resultId: pages[0].id,
          name: pages[0].title,
          href: `${DUMMY_CONFLUENCE_HOST}${pages[0].url}?search_id=search_id`,
          containerName: pages[0].space,
          analyticsType: AnalyticsType.RecentConfluence,
          resultType: ResultType.ConfluenceObjectResult,
          contentType: ContentType.ConfluencePage,
          containerId: 'abc',
          iconClass: 'iconClass',
        },
        {
          resultId: pages[1].id,
          name: pages[1].title,
          href: `${DUMMY_CONFLUENCE_HOST}${pages[1].url}?search_id=search_id`,
          containerName: pages[1].space,
          analyticsType: AnalyticsType.RecentConfluence,
          resultType: ResultType.ConfluenceObjectResult,
          contentType: ContentType.ConfluenceBlogpost,
          containerId: 'abc',
          iconClass: 'iconClass',
        },
      ]);
    });

    it('should not break if no results are returned', async () => {
      mockRecentlyViewedPages([]);
      const result = await confluenceClient.getRecentItems('search_id');
      expect(result).toEqual([]);
    });
  });

  describe('getRecentSpaces', () => {
    it('should return confluence spaces', async () => {
      const spaces: RecentSpace[] = [MOCK_SPACE, MOCK_SPACE];

      mockRecentlyViewedSpaces(spaces);

      const result = await confluenceClient.getRecentSpaces('search_id');

      const expectedResults: ContainerResult[] = [
        {
          resultId: MOCK_SPACE.id,
          name: MOCK_SPACE.name,
          href: `${DUMMY_CONFLUENCE_HOST}/spaces/${
            MOCK_SPACE.key
          }/overview?search_id=search_id`,
          avatarUrl: MOCK_SPACE.icon,
          analyticsType: AnalyticsType.RecentConfluence,
          resultType: ResultType.GenericContainerResult,
          contentType: ContentType.ConfluenceSpace,
        },
        {
          resultId: MOCK_SPACE.id,
          name: MOCK_SPACE.name,
          href: `${DUMMY_CONFLUENCE_HOST}/spaces/${
            MOCK_SPACE.key
          }/overview?search_id=search_id`,
          avatarUrl: MOCK_SPACE.icon,
          analyticsType: AnalyticsType.RecentConfluence,
          resultType: ResultType.GenericContainerResult,
          contentType: ContentType.ConfluenceSpace,
        },
      ];

      expect(result).toEqual(expectedResults);
    });

    it('should not break if no spaces are returned', async () => {
      mockRecentlyViewedSpaces([]);
      const result = await confluenceClient.getRecentSpaces('search_id');
      expect(result).toEqual([]);
    });
  });

  describe('searchPeopleInQuickNav', () => {
    it('should return correct results', async () => {
      const mockResults = [
        [
          mockQuickNavResult(BLOG_CLASSNAME),
          mockQuickNavResult(PAGE_CLASSNAME),
        ],
        [mockQuickNavResult(PEOPLE_CLASSNAME)],
      ];

      mockQuickNavSearch(mockResults);

      const results = await confluenceClient.searchPeopleInQuickNav(
        'abc',
        '123',
      );

      const expectedResults: PersonResult[] = [
        {
          resultId: '123',
          name: 'name',
          href: `/href?search_id=123`,
          analyticsType: AnalyticsType.ResultPerson,
          resultType: ResultType.PersonResult,
          contentType: ContentType.Person,
          avatarUrl: 'icon',
          mentionName: 'name',
          presenceMessage: '',
        },
      ];

      expect(results).toEqual(expectedResults);
    });

    it('should filter out people results', async () => {
      const mockResults = [
        [
          mockQuickNavResult(SPACE_CLASSNAME),
          mockQuickNavResult(PEOPLE_CLASSNAME),
        ],
      ];

      mockQuickNavSearch(mockResults);

      const results = await confluenceClient.searchPeopleInQuickNav(
        'abc',
        '123',
      );

      expect(results).toHaveLength(1);
      expect(results[0].resultType).toEqual(ResultType.PersonResult);
    });

    it('should format hrefs correctly when they already have query params', async () => {
      const mockResult = mockQuickNavResult(PEOPLE_CLASSNAME);

      // change the href to include a query param
      mockResult.href = `${mockResult.href}?test=abc`;
      const mockResults = [[mockResult]];

      mockQuickNavSearch(mockResults);

      const results = await confluenceClient.searchPeopleInQuickNav(
        'abc',
        '123',
      );

      expect(results[0].href).toEqual('/href?test=abc&search_id=123');
    });

    // quick nav's API sends pre-escaped content, different to what we normally expect
    // so testing that we remember to unescape it before passing it into the component.
    it('should unescape html entities in the name and spaceNames of results', async () => {
      const mockResult = mockQuickNavResult(PEOPLE_CLASSNAME);

      // Make the name include some entities, not intended to be comprehensive
      mockResult.name = 'name &amp; &gt; &lt;';

      const mockResults = [[mockResult]];

      mockQuickNavSearch(mockResults);

      const results = await confluenceClient.searchPeopleInQuickNav(
        'abc',
        '123',
      );

      expect(results[0].name).toEqual('name & > <');
    });
  });
});
