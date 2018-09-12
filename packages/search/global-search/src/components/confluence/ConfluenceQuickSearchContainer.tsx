import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withAnalytics, FireAnalyticsEvent } from '@atlaskit/analytics';
import { ConfluenceClient } from '../../api/ConfluenceClient';
import {
  CrossProductSearchClient,
  CrossProductSearchResults,
  EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
  Scope,
} from '../../api/CrossProductSearchClient';
import { Result } from '../../model/Result';
import { PeopleSearchClient } from '../../api/PeopleSearchClient';
import ConfluenceSearchResults from './ConfluenceSearchResults';
import { SearchScreenCounter, ScreenCounter } from '../../util/ScreenCounter';
import {
  LinkComponent,
  ReferralContextIdentifiers,
} from '../GlobalQuickSearchWrapper';
import {
  redirectToConfluenceAdvancedSearch,
  handlePromiseError,
} from '../SearchResultsUtil';
import { CreateAnalyticsEventFn } from '../analytics/types';
import performanceNow from '../../util/performance-now';
import QuickSearchContainer from '../common/QuickSearchContainer';
import { sliceResults } from './ConfluenceSearchResultsMapper';

export interface Props {
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  confluenceClient: ConfluenceClient;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
  linkComponent?: LinkComponent;
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  referralContextIdentifiers?: ReferralContextIdentifiers;
  isSendSearchTermsEnabled?: boolean;
  useAggregatorForConfluenceObjects: boolean;
}

/**
 * Container Component that handles the data fetching when the user interacts with Search.
 */
export class ConfluenceQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps
> {
  screenCounters: {
    preQueryScreenCounter: ScreenCounter;
    postQueryScreenCounter: ScreenCounter;
  };

  constructor(props) {
    super(props);
    const preQueryScreenCounter = new SearchScreenCounter();
    const postQueryScreenCounter = new SearchScreenCounter();
    this.screenCounters = {
      preQueryScreenCounter,
      postQueryScreenCounter,
    };
  }

  handleSearchSubmit = ({ target }) => {
    const query = target.value;
    redirectToConfluenceAdvancedSearch(query);
  };

  async searchQuickNav(
    query: string,
    searchSessionId: string,
  ): Promise<Result[]> {
    const results = await this.props.confluenceClient.searchQuickNav(
      query,
      searchSessionId,
    );
    return results;
  }

  async searchCrossProductConfluence(
    query: string,
    searchSessionId: string,
  ): Promise<CrossProductSearchResults> {
    const scopes = this.props.useAggregatorForConfluenceObjects
      ? [Scope.ConfluencePageBlogAttachment, Scope.ConfluenceSpace]
      : [Scope.ConfluenceSpace];

    const results = await this.props.crossProductSearchClient.search(
      query,
      searchSessionId,
      scopes,
    );
    return results;
  }

  async searchPeople(query: string): Promise<Result[]> {
    const results = await this.props.peopleSearchClient.search(query);
    return results;
  }

  // TODO extract
  handleSearchErrorAnalytics(error, source: string): void {
    const { firePrivateAnalyticsEvent } = this.props;
    if (firePrivateAnalyticsEvent) {
      try {
        firePrivateAnalyticsEvent(
          'atlassian.fabric.global-search.search-error',
          {
            name: error.name,
            message: error.message,
            source: source,
          },
        );
      } catch (error) {
        // TODO logging on error
      }
    }
  }

  handleSearchErrorAnalyticsThunk = (
    source: string,
  ): ((reason: any) => void) => error =>
    this.handleSearchErrorAnalytics(error, source);

  getSearchResults = (query, sessionId, startTime) => {
    const useAggregator = this.props.useAggregatorForConfluenceObjects;

    const quickNavPromise = useAggregator
      ? Promise.resolve([])
      : this.searchQuickNav(query, sessionId).catch(error => {
          this.handleSearchErrorAnalytics(error, 'confluence.quicknav');
          // rethrow to fail the promise
          throw error;
        });
    const confXpSearchPromise = handlePromiseError(
      this.searchCrossProductConfluence(query, sessionId),
      EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
      this.handleSearchErrorAnalyticsThunk('xpsearch-confluence'),
    );

    const searchPeoplePromise = handlePromiseError(
      this.searchPeople(query),
      [],
      this.handleSearchErrorAnalyticsThunk('search-people'),
    );

    const mapPromiseToPerformanceTime = p =>
      p.then(() => performanceNow() - startTime);

    const timingPromise = [
      quickNavPromise,
      confXpSearchPromise,
      searchPeoplePromise,
    ].map(mapPromiseToPerformanceTime);

    return Promise.all([
      quickNavPromise,
      confXpSearchPromise,
      searchPeoplePromise,
      ...timingPromise,
    ]).then(
      ([
        objectResults = [],
        xpsearchResults = EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
        peopleResults = [],
        quickNavElapsedMs,
        confSearchElapsedMs,
        peopleElapsedMs,
      ]) => ({
        results: {
          objects: useAggregator
            ? xpsearchResults.results.get(Scope.ConfluencePageBlogAttachment) ||
              []
            : objectResults,
          spaces: xpsearchResults.results.get(Scope.ConfluenceSpace) || [],
          people: peopleResults,
        },
        timings: {
          quickNavElapsedMs,
          confSearchElapsedMs,
          peopleElapsedMs,
        },
        experimentId: xpsearchResults.experimentId,
        abTest: xpsearchResults.abTest,
      }),
    );
  };

  getRecentItems = sessionId => {
    const { confluenceClient, peopleSearchClient } = this.props;

    const recentActivityPromisesMap = {
      'recent-confluence-items': confluenceClient.getRecentItems(sessionId),
      'recent-confluence-spaces': confluenceClient.getRecentSpaces(sessionId),
      'recent-people': peopleSearchClient.getRecentPeople(),
    };

    const recentActivityPromises = Object.keys(recentActivityPromisesMap).map(
      key =>
        handlePromiseError(
          recentActivityPromisesMap[key],
          [],
          this.handleSearchErrorAnalyticsThunk(key),
        ),
    );

    return Promise.all(recentActivityPromises).then(
      ([
        recentlyViewedPages = [],
        recentlyViewedSpaces = [],
        recentlyInteractedPeople = [],
      ]) => ({
        results: {
          objects: recentlyViewedPages,
          spaces: recentlyViewedSpaces,
          people: recentlyInteractedPeople,
        },
      }),
    );
  };

  getSearchResultsComponent = ({
    retrySearch,
    latestSearchQuery,
    isError,
    searchResults,
    isLoading,
    recentItems,
    keepPreQueryState,
    searchSessionId,
  }) => {
    return (
      <ConfluenceSearchResults
        retrySearch={retrySearch}
        query={latestSearchQuery}
        isError={isError}
        searchResults={searchResults}
        recentItems={recentItems}
        isLoading={isLoading}
        keepPreQueryState={keepPreQueryState}
        searchSessionId={searchSessionId}
        referralContextIdentifiers={this.props.referralContextIdentifiers}
        {...this.screenCounters}
      />
    );
  };
  render() {
    const { linkComponent, isSendSearchTermsEnabled } = this.props;

    return (
      <QuickSearchContainer
        placeholder={this.props.intl.formatMessage({
          id: 'global-search.confluence.search-placeholder',
        })}
        linkComponent={linkComponent}
        getSearchResultsComponent={this.getSearchResultsComponent}
        getRecentItems={this.getRecentItems}
        getSearchResults={this.getSearchResults}
        handleSearchSubmit={this.handleSearchSubmit}
        isSendSearchTermsEnabled={isSendSearchTermsEnabled}
        getDisplayedResults={sliceResults}
      />
    );
  }
}

export default injectIntl<Props>(
  withAnalytics(ConfluenceQuickSearchContainer, {}, {}),
);
