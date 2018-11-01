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
  ABTest,
} from '../../api/CrossProductSearchClient';
import { Scope } from '../../api/types';
import { Result, ResultsWithTiming } from '../../model/Result';
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
import { messages } from '../../messages';
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
  useQuickNavForPeopleResults?: boolean;
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

  async searchCrossProductConfluence(
    query: string,
    sessionId: string,
  ): Promise<CrossProductSearchResults> {
    const {
      crossProductSearchClient,
      useCPUSForPeopleResults,
      referralContextIdentifiers,
    } = this.props;

    let scopes = [Scope.ConfluencePageBlogAttachment, Scope.ConfluenceSpace];

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

  async searchPeople(query: string, sessionId: string): Promise<Result[]> {
    const {
      useCPUSForPeopleResults,
      useQuickNavForPeopleResults,
      confluenceClient,
      peopleSearchClient,
    } = this.props;

    if (useQuickNavForPeopleResults) {
      return handlePromiseError(
        confluenceClient.searchPeopleInQuickNav(query, sessionId),
        [],
        this.handleSearchErrorAnalyticsThunk('search-people-quicknav'),
      );
    }

    // people results will be returned by xpsearch
    if (useCPUSForPeopleResults) {
      return Promise.resolve([]);
    }

    // fall back to directory search
    return handlePromiseError(
      peopleSearchClient.search(query),
      [],
      this.handleSearchErrorAnalyticsThunk('search-people'),
    );
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
    const { useCPUSForPeopleResults } = this.props;

    const confXpSearchPromise = handlePromiseError(
      this.searchCrossProductConfluence(query, sessionId),
      EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
      this.handleSearchErrorAnalyticsThunk('xpsearch-confluence'),
    );

    const searchPeoplePromise = this.searchPeople(query, sessionId);

    const mapPromiseToPerformanceTime = (p: Promise<any>) =>
      p.then(() => performanceNow() - startTime);

    return Promise.all<CrossProductSearchResults, Result[], number, number>([
      confXpSearchPromise,
      searchPeoplePromise,
      mapPromiseToPerformanceTime(confXpSearchPromise),
      mapPromiseToPerformanceTime(searchPeoplePromise),
    ]).then(
      ([
        xpsearchResults,
        peopleResults,
        confSearchElapsedMs,
        peopleElapsedMs,
      ]) => ({
        results: {
          objects:
            xpsearchResults.results.get(Scope.ConfluencePageBlogAttachment) ||
            [],
          spaces: xpsearchResults.results.get(Scope.ConfluenceSpace) || [],
          people: useCPUSForPeopleResults
            ? xpsearchResults.results.get(Scope.People) || []
            : peopleResults,
        },
        timings: {
          confSearchElapsedMs,
          peopleElapsedMs,
        },
      }),
    );
  };

  getAbTestData = (sessionId: string): Promise<ABTest | undefined> => {
    return this.props.crossProductSearchClient.getAbTestData(
      Scope.ConfluencePageBlog,
      {
        sessionId,
      },
    );
  };

  getRecentItems = (sessionId: string): Promise<ResultsWithTiming> => {
    const { confluenceClient, peopleSearchClient } = this.props;

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

    return Promise.all(recentActivityPromises).then(
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
            {...messages.no_recent_activity_body}
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
        placeholder={this.props.intl.formatMessage(
          messages.confluence_search_placeholder,
        )}
        linkComponent={linkComponent}
        getSearchResultsComponent={this.getSearchResultsComponent}
        getRecentItems={this.getRecentItems}
        getSearchResults={this.getSearchResults}
        getAbTestData={this.getAbTestData}
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
