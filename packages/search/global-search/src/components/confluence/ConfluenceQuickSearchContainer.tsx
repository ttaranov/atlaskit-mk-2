import * as React from 'react';
import {
  injectIntl,
  InjectedIntlProps,
  FormattedHTMLMessage,
} from 'react-intl';
import { withAnalytics, FireAnalyticsEvent } from '@atlaskit/analytics';
import { ConfluenceClient } from '../../api/ConfluenceClient';
import {
  CrossProductSearchClient,
  CrossProductSearchResults,
  EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
} from '../../api/CrossProductSearchClient';
import { Scope } from '../../api/types';
import {
  Result,
  ResultsWithTiming,
  GenericResultMap,
} from '../../model/Result';
import { PeopleSearchClient } from '../../api/PeopleSearchClient';
import { SearchScreenCounter } from '../../util/ScreenCounter';
import {
  LinkComponent,
  ReferralContextIdentifiers,
  Logger,
} from '../GlobalQuickSearchWrapper';
import {
  redirectToConfluenceAdvancedSearch,
  handlePromiseError,
} from '../SearchResultsUtil';
import { CreateAnalyticsEventFn } from '../analytics/types';
import performanceNow from '../../util/performance-now';
import QuickSearchContainer from '../common/QuickSearchContainer';
import { sliceResults } from './ConfluenceSearchResultsMapper';
import NoResultsState from './NoResultsState';
import SearchResultsComponent from '../common/SearchResults';
import { getConfluenceAdvancedSearchLink } from '../SearchResultsUtil';
import AdvancedSearchGroup from './AdvancedSearchGroup';
import {
  mapRecentResultsToUIGroups,
  mapSearchResultsToUIGroups,
} from './ConfluenceSearchResultsMapper';

export interface Props {
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  confluenceClient: ConfluenceClient;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
  linkComponent?: LinkComponent;
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  referralContextIdentifiers?: ReferralContextIdentifiers;
  isSendSearchTermsEnabled?: boolean;
  useAggregatorForConfluenceObjects?: boolean;
  useCPUSForPeopleResults?: boolean;
  logger: Logger;
}

const LOGGER_NAME = 'AK.GlobalSearch.ConfluenceQuickSearchContainer';
/**
 * Container Component that handles the data fetching when the user interacts with Search.
 */
export class ConfluenceQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps
> {
  screenCounters = {
    preQueryScreenCounter: new SearchScreenCounter(),
    postQueryScreenCounter: new SearchScreenCounter(),
  };

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
    sessionId: string,
  ): Promise<CrossProductSearchResults> {
    const {
      crossProductSearchClient,
      useAggregatorForConfluenceObjects,
      useCPUSForPeopleResults,
      referralContextIdentifiers,
    } = this.props;

    let scopes = useAggregatorForConfluenceObjects
      ? [Scope.ConfluencePageBlogAttachment, Scope.ConfluenceSpace]
      : [Scope.ConfluenceSpace];

    if (useCPUSForPeopleResults) {
      scopes.push(Scope.People);
    }

    const referrerId =
      referralContextIdentifiers && referralContextIdentifiers.searchReferrerId;

    const results = await crossProductSearchClient.search(
      query,
      { sessionId, referrerId },
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
      } catch (e) {
        this.props.logger.safeError(
          LOGGER_NAME,
          'Can not fire event atlassian.fabric.global-search.search-error',
          e,
        );
      }
    }
  }

  handleSearchErrorAnalyticsThunk = (
    source: string,
  ): ((reason: any) => void) => error => {
    this.handleSearchErrorAnalytics(error, source);
    this.props.logger.safeError(
      LOGGER_NAME,
      `error in promise ${source}`,
      error,
    );
  };

  getSearchResults = (
    query: string,
    sessionId: string,
    startTime: number,
  ): Promise<ResultsWithTiming> => {
    const {
      useAggregatorForConfluenceObjects,
      useCPUSForPeopleResults,
    } = this.props;

    const quickNavPromise = useAggregatorForConfluenceObjects
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

    const searchPeoplePromise = useCPUSForPeopleResults
      ? Promise.resolve([])
      : handlePromiseError(
          this.searchPeople(query),
          [],
          this.handleSearchErrorAnalyticsThunk('search-people'),
        );

    const mapPromiseToPerformanceTime = (p: Promise<any>) =>
      p.then(() => performanceNow() - startTime);

    return Promise.all<
      Result[],
      CrossProductSearchResults,
      Result[],
      number,
      number,
      number
    >([
      quickNavPromise,
      confXpSearchPromise,
      searchPeoplePromise,
      mapPromiseToPerformanceTime(quickNavPromise),
      mapPromiseToPerformanceTime(confXpSearchPromise),
      mapPromiseToPerformanceTime(searchPeoplePromise),
    ]).then(
      ([
        objectResults,
        xpsearchResults,
        peopleResults,
        quickNavElapsedMs,
        confSearchElapsedMs,
        peopleElapsedMs,
      ]) => ({
        results: {
          objects: useAggregatorForConfluenceObjects
            ? xpsearchResults.results.get(Scope.ConfluencePageBlogAttachment) ||
              []
            : objectResults,
          spaces: xpsearchResults.results.get(Scope.ConfluenceSpace) || [],
          people: useCPUSForPeopleResults
            ? xpsearchResults.results.get(Scope.People) || []
            : peopleResults,
        },
        timings: {
          quickNavElapsedMs,
          confSearchElapsedMs,
          peopleElapsedMs,
        },
      }),
    );
  };

  getRecentItems = async (sessionId: string): Promise<ResultsWithTiming> => {
    const {
      confluenceClient,
      peopleSearchClient,
      crossProductSearchClient,
    } = this.props;

    const recentActivityPromisesMap = {
      'recent-confluence-items': confluenceClient.getRecentItems(sessionId),
      'recent-confluence-spaces': confluenceClient.getRecentSpaces(sessionId),
      'recent-people': peopleSearchClient.getRecentPeople(),
    };

    const recentActivityPromises: Promise<Result[]>[] = Object.keys(
      recentActivityPromisesMap,
    ).map(key =>
      handlePromiseError(
        recentActivityPromisesMap[key],
        [],
        this.handleSearchErrorAnalyticsThunk(key),
      ),
    );

    const resultsPromise: Promise<{ results: GenericResultMap }> = Promise.all(
      recentActivityPromises,
    ).then(
      ([
        recentlyViewedPages,
        recentlyViewedSpaces,
        recentlyInteractedPeople,
      ]) => ({
        results: {
          objects: recentlyViewedPages,
          spaces: recentlyViewedSpaces,
          people: recentlyInteractedPeople,
        },
      }),
    );

    const abTestPromise = crossProductSearchClient.getAbTestData({
      sessionId,
    });

    const [abTest, results] = await Promise.all([
      abTestPromise,
      resultsPromise,
    ]);

    return {
      abTest,
      results: results.results,
    };
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
      <SearchResultsComponent
        query={latestSearchQuery}
        isError={isError}
        isLoading={isLoading}
        retrySearch={retrySearch}
        keepPreQueryState={keepPreQueryState}
        searchSessionId={searchSessionId}
        {...this.screenCounters}
        referralContextIdentifiers={this.props.referralContextIdentifiers}
        renderNoRecentActivity={() => (
          <FormattedHTMLMessage
            id="global-search.no-recent-activity-body"
            values={{ url: getConfluenceAdvancedSearchLink() }}
          />
        )}
        renderAdvancedSearchGroup={(analyticsData?) => (
          <AdvancedSearchGroup
            key="advanced"
            query={latestSearchQuery}
            analyticsData={analyticsData}
          />
        )}
        getPreQueryGroups={() => mapRecentResultsToUIGroups(recentItems)}
        getPostQueryGroups={() => mapSearchResultsToUIGroups(searchResults)}
        renderNoResult={() => <NoResultsState query={latestSearchQuery} />}
      />
    );
  };

  render() {
    const { linkComponent, isSendSearchTermsEnabled, logger } = this.props;

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
        logger={logger}
      />
    );
  }
}

export default injectIntl<Props>(
  withAnalytics(ConfluenceQuickSearchContainer, {}, {}),
);
