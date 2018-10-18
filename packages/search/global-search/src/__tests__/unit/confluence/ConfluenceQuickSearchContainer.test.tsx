import * as React from 'react';
import {
  ConfluenceQuickSearchContainer,
  Props,
} from '../../../components/confluence/ConfluenceQuickSearchContainer';
import { noResultsCrossProductSearchClient } from '../mocks/_mockCrossProductSearchClient';
import { noResultsPeopleSearchClient } from '../mocks/_mockPeopleSearchClient';
import {
  noResultsConfluenceClient,
  makeConfluenceClient,
  singleResultQuickNav,
} from '../mocks/_mockConfluenceClient';
import { shallowWithIntl } from '../helpers/_intl-enzyme-test-helper';
import QuickSearchContainer, {
  Props as QuickSearchContainerProps,
} from '../../../components/common/QuickSearchContainer';
import { makeConfluenceObjectResult, makePersonResult } from '../_test-util';
import { Scope } from '../../../api/types';
import { Result } from '../../../model/Result';
import {
  EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
  SearchSession,
  ABTest,
} from '../../../api/CrossProductSearchClient';
import { mockLogger } from '../mocks/_mockLogger';

const sessionId = 'sessionId';
function render(partialProps?: Partial<Props>) {
  const logger = mockLogger();
  const props: Props = {
    confluenceClient: noResultsConfluenceClient,
    crossProductSearchClient: noResultsCrossProductSearchClient,
    peopleSearchClient: noResultsPeopleSearchClient,
    useQuickNavForPeopleResults: false,
    useCPUSForPeopleResults: false,
    logger,
    ...partialProps,
  };

  // @ts-ignore - doesn't recognise injected intl prop
  return shallowWithIntl(<ConfluenceQuickSearchContainer {...props} />);
}

describe('ConfluenceQuickSearchContainer', () => {
  it('should render QuickSearchContainer with correct props', () => {
    const wrapper = render();
    const quickSearchContainer = wrapper.find(QuickSearchContainer);

    const props = quickSearchContainer.props();
    expect(props).toHaveProperty('getSearchResultsComponent');
  });

  it('should return recent viewed items', async () => {
    const mockConfluenceClient = makeConfluenceClient({
      getRecentItems() {
        return Promise.resolve([makeConfluenceObjectResult()]);
      },
    });

    const wrapper = render({
      confluenceClient: mockConfluenceClient,
    });
    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const recentItems = await (quickSearchContainer.props() as QuickSearchContainerProps).getRecentItems(
      sessionId,
    );
    expect(recentItems).toMatchObject({
      results: {
        objects: [
          {
            analyticsType: 'result-confluence',
            resultType: 'confluence-object-result',
            containerName: 'containerName',
            contentType: 'confluence-page',
            containerId: 'containerId',
            name: 'name',
            avatarUrl: 'avatarUrl',
            href: 'href',
          },
        ],
        spaces: [],
        people: [],
      },
    });
  });

  it('should return ab test data', async () => {
    const abTest: ABTest = {
      abTestId: 'abTestId',
      experimentId: 'experimentId',
      controlId: 'controlId',
    };

    const wrapper = render({
      confluenceClient: noResultsConfluenceClient,
      crossProductSearchClient: {
        search(query: string) {
          return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
        },
        getAbTestData() {
          return Promise.resolve(abTest);
        },
      },
    });
    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const receivedAbTest = await (quickSearchContainer.props() as QuickSearchContainerProps).getAbTestData(
      sessionId,
    );

    expect(receivedAbTest).toMatchObject(abTest);
  });

  it('should return search result', async () => {
    const wrapper = render({
      peopleSearchClient: {
        search() {
          return Promise.resolve([makePersonResult()]);
        },
        getRecentPeople() {
          return Promise.resolve([]);
        },
      },
    });

    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const searchResults = await (quickSearchContainer.props() as QuickSearchContainerProps).getSearchResults(
      'query',
      sessionId,
      100,
    );

    expect(searchResults).toMatchObject({
      results: {
        objects: [],
        spaces: [],
        people: [
          {
            mentionName: 'mentionName',
            presenceMessage: 'presenceMessage',
            analyticsType: 'result-person',
            resultType: 'person-result',
            name: 'name',
            avatarUrl: 'avatarUrl',
            href: 'href',
          },
        ],
      },
      // assert search performance timings
      timings: {
        confSearchElapsedMs: expect.any(Number),
        peopleElapsedMs: expect.any(Number),
      },
    });
  });

  it('should use CPUs for people results when enabled', async () => {
    const wrapper = render({
      useCPUSForPeopleResults: true,
      crossProductSearchClient: {
        search(query: string, searchSession: SearchSession, scopes: Scope[]) {
          // only return items when People scope is set
          if (scopes.find(s => s === Scope.People)) {
            const results = new Map<Scope, Result[]>();
            results.set(Scope.People, [makePersonResult()]);

            return Promise.resolve({
              results: results,
            });
          }

          return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
        },
        getAbTestData(scope: Scope, searchSession: SearchSession) {
          return Promise.resolve(undefined);
        },
      },
    });

    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const searchResults = await (quickSearchContainer.props() as QuickSearchContainerProps).getSearchResults(
      'query',
      sessionId,
      100,
    );

    expect(searchResults.results.people).toEqual([
      expect.objectContaining({
        mentionName: 'mentionName',
        presenceMessage: 'presenceMessage',
        analyticsType: 'result-person',
        resultType: 'person-result',
        name: 'name',
        avatarUrl: 'avatarUrl',
        href: 'href',
        resultId: expect.any(String),
      }),
    ]);
  });

  it('should use quick nav for people results when enabled', async () => {
    const wrapper = render({
      useQuickNavForPeopleResults: true,
      crossProductSearchClient: noResultsCrossProductSearchClient,
      confluenceClient: singleResultQuickNav(),
    });

    const quickSearchContainer = wrapper.find(QuickSearchContainer);
    const searchResults = await (quickSearchContainer.props() as QuickSearchContainerProps).getSearchResults(
      'query',
      sessionId,
      100,
    );

    expect(searchResults.results.people).toEqual([
      expect.objectContaining({
        mentionName: 'mentionName',
        presenceMessage: 'presenceMessage',
        analyticsType: 'result-person',
        resultType: 'person-result',
        name: 'name',
        avatarUrl: 'avatarUrl',
        href: 'href',
        resultId: expect.any(String),
      }),
    ]);
  });
});
