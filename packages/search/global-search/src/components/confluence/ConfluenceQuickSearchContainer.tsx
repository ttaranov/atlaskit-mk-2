import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { withAnalytics, FireAnalyticsEvent } from '@atlaskit/analytics';
import * as uuid from 'uuid/v4';
import GlobalQuickSearch from '../GlobalQuickSearch';
import { ConfluenceClient } from '../../api/ConfluenceClient';
import {
  CrossProductSearchClient,
  Scope,
} from '../../api/CrossProductSearchClient';
import { Result } from '../../model/Result';
import { PeopleSearchClient } from '../../api/PeopleSearchClient';
import ConfluenceSearchResults, {
  MAX_PAGES_BLOGS_ATTACHMENTS,
  MAX_SPACES,
  MAX_PEOPLE,
} from './ConfluenceSearchResults';
import { SearchScreenCounter, ScreenCounter } from '../../util/ScreenCounter';
import {
  LinkComponent,
  ReferralContextIdentifiers,
} from '../GlobalQuickSearchWrapper';
import {
  redirectToConfluenceAdvancedSearch,
  handlePromiseError,
} from '../SearchResultsUtil';
import {
  ShownAnalyticsAttributes,
  buildShownEventDetails,
  SearchPerformanceTiming,
} from '../../util/analytics-util';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { take } from '../SearchResultsUtil';
import {
  firePreQueryShownEvent,
  firePostQueryShownEvent,
} from '../../util/analytics-event-helper';
import { CreateAnalyticsEventFn } from '../analytics/types';
import performanceNow from '../../util/performance-now';

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

export interface State {
  latestSearchQuery: string;
  searchSessionId: string;
  isLoading: boolean;
  isError: boolean;
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
  recentlyInteractedPeople: Result[];
  objectResults: Result[];
  spaceResults: Result[];
  peopleResults: Result[];
  keepPreQueryState: boolean;
}

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class ConfluenceQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps,
  State
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

  state = {
    isLoading: true,
    isError: false,
    latestSearchQuery: '',
    searchSessionId: uuid(), // unique id for search attribution
    recentlyViewedPages: [],
    recentlyViewedSpaces: [],
    recentlyInteractedPeople: [],
    objectResults: [],
    spaceResults: [],
    peopleResults: [],
    keepPreQueryState: true,
  };

  handleSearch = (newLatestSearchQuery: string) => {
    if (this.state.latestSearchQuery !== newLatestSearchQuery) {
      this.setState({
        latestSearchQuery: newLatestSearchQuery,
        isLoading: true,
      });
    }

    if (newLatestSearchQuery.length === 0) {
      // reset search results so that internal state between query and results stays consistent
      this.setState(
        {
          isError: false,
          isLoading: false,
          objectResults: [],
          spaceResults: [],
          peopleResults: [],
          keepPreQueryState: true,
        },
        () => this.fireShownPreQueryEvent(),
      );
    } else {
      this.doSearch(newLatestSearchQuery);
    }
  };

  handleSearchSubmit = ({ target }) => {
    const query = target.value;
    redirectToConfluenceAdvancedSearch(query);
  };

  async searchQuickNav(query: string): Promise<Result[]> {
    const results = await this.props.confluenceClient.searchQuickNav(
      query,
      this.state.searchSessionId,
    );
    return results;
  }

  async searchCrossProductConfluence(
    query: string,
  ): Promise<Map<Scope, Result[]>> {
    const scopes = this.props.useAggregatorForConfluenceObjects
      ? [Scope.ConfluencePageBlogAttachment, Scope.ConfluenceSpace]
      : [Scope.ConfluenceSpace];

    const results = await this.props.crossProductSearchClient.search(
      query,
      this.state.searchSessionId,
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

  fireShownPreQueryEvent(requestStartTime?: number) {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      const elapsedMs: number = requestStartTime
        ? performanceNow() - requestStartTime
        : 0;

      const eventAttributes: ShownAnalyticsAttributes = buildShownEventDetails(
        take(this.state.recentlyViewedPages, MAX_PAGES_BLOGS_ATTACHMENTS),
        take(this.state.recentlyViewedSpaces, MAX_SPACES),
        take(this.state.recentlyInteractedPeople, MAX_PEOPLE),
      );

      firePreQueryShownEvent(
        eventAttributes,
        elapsedMs,
        this.state.searchSessionId,
        createAnalyticsEvent,
      );
    }
  }

  fireShownPostQueryEvent(
    searchPerformanceTiming: SearchPerformanceTiming,
    resultsDetails: ShownAnalyticsAttributes,
  ) {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      firePostQueryShownEvent(
        resultsDetails,
        searchPerformanceTiming,
        this.state.searchSessionId,
        this.state.latestSearchQuery,
        createAnalyticsEvent,
      );
    }
  }

  doSearch = async (query: string) => {
    const useAggregator = this.props.useAggregatorForConfluenceObjects;
    const startTime: number = performanceNow();

    this.setState({
      isLoading: true,
    });
    const quickNavPromise = useAggregator
      ? Promise.resolve([])
      : this.searchQuickNav(query).catch(error => {
          this.handleSearchErrorAnalytics(error, 'confluence.quicknav');
          // rethrow to fail the promise
          throw error;
        });
    const confXpSearchPromise = handlePromiseError(
      this.searchCrossProductConfluence(query),
      new Map<Scope, Result[]>(),
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

    try {
      const [
        objectResults = [],
        xpsearchResultsMap = new Map<Scope, Result[]>(),
        peopleResults = [],
        quickNavElapsedMs,
        confSearchElapsedMs,
        peopleElapsedMs,
      ] = await Promise.all([
        quickNavPromise,
        confXpSearchPromise,
        searchPeoplePromise,
        ...timingPromise,
      ]);

      const elapsedMs = performanceNow() - startTime;
      if (this.state.latestSearchQuery === query) {
        this.setState(
          {
            objectResults: useAggregator
              ? xpsearchResultsMap.get(Scope.ConfluencePageBlogAttachment)
              : objectResults,
            spaceResults: xpsearchResultsMap.get(Scope.ConfluenceSpace) || [],
            peopleResults,
            isError: false,
            isLoading: false,
            keepPreQueryState: false,
          },
          () => {
            this.fireShownPostQueryEvent(
              {
                startTime,
                elapsedMs,
                confSearchElapsedMs,
                peopleElapsedMs,
                quickNavElapsedMs,
                usingAggregator: useAggregator,
              },
              buildShownEventDetails(
                take(this.state.objectResults, MAX_PAGES_BLOGS_ATTACHMENTS),
                take(this.state.spaceResults, MAX_SPACES),
                take(this.state.peopleResults, MAX_PEOPLE),
              ),
            );
          },
        );
      }
    } catch {
      this.setState({
        isError: true,
        isLoading: false,
        keepPreQueryState: false,
      });
    }
  };

  handleMount = async () => {
    const startTime = performanceNow();

    this.setState({
      isLoading: true,
    });

    const sessionId = this.state.searchSessionId;
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

    try {
      const [
        recentlyViewedPages = [],
        recentlyViewedSpaces = [],
        recentlyInteractedPeople = [],
      ] = await Promise.all(recentActivityPromises);
      this.setState(
        {
          recentlyViewedPages,
          recentlyViewedSpaces,
          recentlyInteractedPeople,
          isLoading: false,
        },
        () => this.fireShownPreQueryEvent(startTime),
      );
    } catch {
      if (this.state.isLoading) {
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  retrySearch = () => {
    this.handleSearch(this.state.latestSearchQuery);
  };

  shouldComponentUpdate(nextProps, nextState) {
    return (
      Object.keys({ ...nextProps, ...this.props })
        .map(key => this.props[key] !== nextProps[key])
        .reduce((acc, value) => acc || value, false) || this.state !== nextState
    );
  }

  render() {
    const {
      linkComponent,
      isSendSearchTermsEnabled,
      referralContextIdentifiers,
    } = this.props;
    const {
      latestSearchQuery,
      isLoading,
      searchSessionId,
      isError,
      objectResults,
      spaceResults,
      peopleResults,
      recentlyViewedPages,
      recentlyViewedSpaces,
      recentlyInteractedPeople,
      keepPreQueryState,
    } = this.state;

    return (
      <GlobalQuickSearch
        onMount={this.handleMount}
        onSearch={this.handleSearch}
        onSearchSubmit={this.handleSearchSubmit}
        isLoading={isLoading}
        placeholder={this.props.intl.formatMessage({
          id: 'global-search.confluence.search-placeholder',
        })}
        linkComponent={linkComponent}
        searchSessionId={searchSessionId}
        isSendSearchTermsEnabled={isSendSearchTermsEnabled}
      >
        <ConfluenceSearchResults
          retrySearch={this.retrySearch}
          query={latestSearchQuery}
          isError={isError}
          objectResults={objectResults}
          spaceResults={spaceResults}
          peopleResults={peopleResults}
          isLoading={isLoading}
          recentlyViewedPages={recentlyViewedPages}
          recentlyViewedSpaces={recentlyViewedSpaces}
          recentlyInteractedPeople={recentlyInteractedPeople}
          keepPreQueryState={keepPreQueryState}
          searchSessionId={searchSessionId}
          referralContextIdentifiers={referralContextIdentifiers}
          {...this.screenCounters}
        />
      </GlobalQuickSearch>
    );
  }
}

export default injectIntl<Props>(
  withAnalyticsEvents()(withAnalytics(ConfluenceQuickSearchContainer, {}, {})),
);
