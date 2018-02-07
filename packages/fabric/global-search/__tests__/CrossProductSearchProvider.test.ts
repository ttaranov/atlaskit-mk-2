import CrossProductSearchProvider, {
  SearchItem,
  CrossProductSearchResponse,
  Scope,
  removeHighlightTags,
  getConfluenceAvatarUrl,
} from '../src/api/CrossProductSearchProvider';
import 'whatwg-fetch';
import * as fetchMock from 'fetch-mock';

function apiWillReturn(state: CrossProductSearchResponse) {
  const opts = {
    method: 'post',
    name: 'xpsearch',
  };

  fetchMock.mock('localhost/quicksearch/v1', state, opts);
}

describe('CrossProductSearchProvider', () => {
  let searchProvider: CrossProductSearchProvider;

  beforeEach(() => {
    searchProvider = new CrossProductSearchProvider('localhost', '123');
  });

  afterEach(fetchMock.restore);

  describe('search', () => {
    it('should return result items', async () => {
      apiWillReturn({
        scopes: [
          {
            id: 'confluence.page' as Scope,
            results: [
              {
                title: 'page name',
                iconCssClass: 'aui-iconfont-page-default',
                url: 'url',
                container: {
                  title: 'containerTitle',
                },
              },
            ],
          },
        ],
      });

      const result = await searchProvider.search('query');
      expect(result.confluence).toHaveLength(1);

      const item = result.confluence[0];
      expect(item.type).toEqual('object');
      expect(item.resultId).toEqual('search-url');
      expect(item.avatarUrl).toEqual(
        'https://home.useast.atlassian.io/confluence-page-icon.svg',
      );
      expect(item.name).toEqual('page name');
      expect(item.href).toEqual('url');
      expect(item.containerName).toEqual('containerTitle');
    });

    it('should handle scope errors', () => {});

    it('should concat base url with url', () => {});

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

    it('should send the right body', async () => {
      apiWillReturn({
        scopes: [],
      });

      const result = await searchProvider.search('query');
      const call = fetchMock.calls('xpsearch')[0];
      const body = JSON.parse(call[1].body);

      expect(body.query).toEqual('query');
      expect(body.cloudId).toEqual('123');
      expect(body.limit).toEqual(5);
      expect(body.scopes).toEqual(['jira.issue', 'confluence.page']);
    });
  });
});
