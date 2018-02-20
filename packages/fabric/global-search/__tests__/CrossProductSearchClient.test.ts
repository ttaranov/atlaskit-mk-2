import CrossProductSearchClient, {
  SearchItem,
  CrossProductSearchResponse,
  Scope,
  removeHighlightTags,
  getConfluenceAvatarUrl,
} from '../src/api/CrossProductSearchClient';
import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';

function apiWillReturn(state: CrossProductSearchResponse) {
  const opts = {
    method: 'post',
    name: 'xpsearch',
  };

  fetchMock.mock('localhost/quicksearch/v1', state, opts);
}

describe('CrossProductSearchClient', () => {
  let searchClient: CrossProductSearchClient;

  beforeEach(() => {
    searchClient = new CrossProductSearchClient('localhost', '123');
  });

  afterEach(fetchMock.restore);

  describe('Confluence', () => {
    it('should return confluence result items', async () => {
      apiWillReturn({
        scopes: [
          {
            id: 'confluence.page' as Scope,
            results: [
              {
                title: '@@@hl@@@page@@@endhl@@@ name',
                baseUrl: 'baseUrl',
                url: '/url',
                iconCssClass: 'aui-iconfont-page-default',
                container: {
                  title: 'containerTitle',
                },
              },
            ],
          },
        ],
      });

      const result = await searchClient.search('query');
      expect(result.confluence).toHaveLength(1);

      const item = result.confluence[0];
      expect(item.type).toEqual('object');
      expect(item.resultId).toEqual('search-/url');
      expect(item.avatarUrl).toEqual(
        'https://home.useast.atlassian.io/confluence-page-icon.svg',
      );
      expect(item.name).toEqual('page name');
      expect(item.href).toEqual('baseUrl/url');
      expect(item.containerName).toEqual('containerTitle');
    });

    it('should parse the highlight tags from the title', () => {
      let text = removeHighlightTags(
        '@@@hl@@@new@@@endhl@@@ @@@hl@@@page@@@endhl@@@',
      );
      expect(text).toEqual('new page');

      text = removeHighlightTags('no highlight');
      expect(text).toEqual('no highlight');
    });

    it('should get the avatarUrl based on iconCssClass', () => {
      let url = getConfluenceAvatarUrl('aui-iconfont-page-default');
      expect(url).toContain('page-icon.svg');

      url = getConfluenceAvatarUrl('aui-iconfont-page-blogpost');
      expect(url).toContain('blogpost-icon.svg');
    });
  });

  describe('Jira', () => {
    it('should return jira result items', async () => {
      apiWillReturn({
        scopes: [
          {
            id: 'jira.issue' as Scope,
            results: [
              {
                key: 'key-1',
                fields: {
                  summary: 'summary',
                },
              },
            ],
          },
        ],
      });

      const result = await searchClient.search('query');
      expect(result.jira).toHaveLength(1);

      const item = result.jira[0];
      expect(item.type).toEqual('object');
      expect(item.name).toEqual('summary');
    });
  });

  it('should return partial results when one scope has an error', async () => {
    apiWillReturn({
      scopes: [
        {
          id: 'jira.issue' as Scope,
          results: [
            {
              key: 'key-1',
              fields: {
                summary: 'summary',
              },
            },
          ],
        },
        {
          id: 'confluence.page' as Scope,
          error: 'TIMEOUT',
          results: [],
        },
      ],
    });

    const result = await searchClient.search('query');

    expect(result.jira).toHaveLength(1);
    expect(result.confluence).toHaveLength(0);
  });

  it('should send the right body', async () => {
    apiWillReturn({
      scopes: [],
    });

    const result = await searchClient.search('query');
    const call = fetchMock.calls('xpsearch')[0];
    const body = JSON.parse(call[0]._bodyText);

    expect(body.query).toEqual('query');
    expect(body.cloudId).toEqual('123');
    expect(body.limit).toEqual(5);
    expect(body.scopes).toEqual(['jira.issue', 'confluence.page']);
  });
});
