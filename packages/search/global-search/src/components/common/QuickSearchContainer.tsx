import * as React from 'react';
import * as uuid from 'uuid/v4';
import { LinkComponent } from '../GlobalQuickSearchWrapper';
import GlobalQuickSearch from '../GlobalQuickSearch';
import performanceNow from '../../util/performance-now';
import {
  GenericResultMap,
  ResultsWithTiming,
  Result,
} from '../../model/Result';
import {
  ShownAnalyticsAttributes,
  buildShownEventDetails,
  PerformanceTiming,
} from '../../util/analytics-util';
import {
  firePreQueryShownEvent,
  firePostQueryShownEvent,
} from '../../util/analytics-event-helper';

import { CreateAnalyticsEventFn } from '../analytics/types';

export interface SearchResultProps extends State {
  retrySearch: Function;
}

export interface Props {
  linkComponent?: LinkComponent;
  getSearchResultsComponent(state: SearchResultProps): React.ReactNode;
  getRecentItems(sessionId: string): Promise<ResultsWithTiming>;
  getSearchResults(
    query: string,
    sessionId: string,
    startTime: number,
  ): Promise<ResultsWithTiming>;

  getDisplayedResults?(results: GenericResultMap): Result[][];
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  handleSearchSubmit?({ target: string }): void;
  isSendSearchTermsEnabled?: boolean;
  placeHolder?: string;
}

export interface State {
  latestSearchQuery: string;
  searchSessionId: string;
  isLoading: boolean;
  isError: boolean;
  keepPreQueryState: boolean;
  searchResults: GenericResultMap | null;
  recentItems: GenericResultMap | null;
}

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class QuickSearchContainer extends React.Component<Props, State> {
  static defaultProps = {
    getDisplayedResults(results: GenericResultMap) {
      return Object.keys(results).map(key => results[key]);
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      latestSearchQuery: '',
      searchSessionId: uuid(), // unique id for search attribution
      recentItems: null,
      searchResults: null,
      keepPreQueryState: true,
    };
  }
  doSearch = async (query: string) => {
    const startTime: number = performanceNow();

    this.setState({
      isLoading: true,
    });

    try {
      const { results, timings } = await this.props.getSearchResults(
        query,
        this.state.searchSessionId,
        startTime,
      );

      const elapsedMs = performanceNow() - startTime;
      if (this.state.latestSearchQuery === query) {
        this.setState(
          {
            searchResults: results,
            isError: false,
            isLoading: false,
            keepPreQueryState: false,
          },
          () => {
            this.fireShownPostQueryEvent(
              startTime,
              elapsedMs,
              this.state.searchResults || {},
              timings || {},
              this.state.searchSessionId,
              this.state.latestSearchQuery,
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

  fireShownPreQueryEvent = (
    searchSessionId,
    recentItems,
    requestStartTime?: number,
  ) => {
    const { createAnalyticsEvent, getDisplayedResults } = this.props;
    if (createAnalyticsEvent && getDisplayedResults) {
      const elapsedMs: number = requestStartTime
        ? performanceNow() - requestStartTime
        : 0;

      const eventAttributes: ShownAnalyticsAttributes = buildShownEventDetails(
        ...getDisplayedResults(recentItems),
      );

      firePreQueryShownEvent(
        eventAttributes,
        elapsedMs,
        searchSessionId,
        createAnalyticsEvent,
      );
    }
  };

  fireShownPostQueryEvent = (
    startTime,
    elapsedMs,
    searchResults,
    timings,
    searchSessionId,
    latestSearchQuery: string,
  ) => {
    const performanceTiming: PerformanceTiming = {
      startTime,
      elapsedMs,
      ...timings,
    };

    const { createAnalyticsEvent, getDisplayedResults } = this.props;
    if (createAnalyticsEvent && getDisplayedResults) {
      const resultsDetails: ShownAnalyticsAttributes = buildShownEventDetails(
        ...getDisplayedResults(searchResults),
      );

      firePostQueryShownEvent(
        resultsDetails,
        performanceTiming,
        searchSessionId,
        latestSearchQuery,
        createAnalyticsEvent,
      );
    }
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
          keepPreQueryState: true,
        },
        () =>
          this.fireShownPreQueryEvent(
            this.state.searchSessionId,
            this.state.recentItems || {},
          ),
      );
    } else {
      this.doSearch(newLatestSearchQuery);
    }
  };

  retrySearch = () => {
    this.handleSearch(this.state.latestSearchQuery);
  };

  handleMount = async () => {
    const startTime = performanceNow();

    if (!this.state.isLoading) {
      this.setState({
        isLoading: true,
      });
    }

    const sessionId = this.state.searchSessionId;

    try {
      const { results } = await this.props.getRecentItems(sessionId);
      this.setState(
        {
          recentItems: results,
          isLoading: false,
        },
        () =>
          this.fireShownPreQueryEvent(
            this.state.searchSessionId,
            this.state.recentItems || {},
            startTime,
          ),
      );
    } catch {
      if (this.state.isLoading) {
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  render() {
    const {
      linkComponent,
      isSendSearchTermsEnabled,
      getSearchResultsComponent,
      placeHolder,
    } = this.props;
    const {
      isLoading,
      searchSessionId,
      latestSearchQuery,
      isError,
      searchResults,
      recentItems,
      keepPreQueryState,
    } = this.state;

    return (
      <GlobalQuickSearch
        onMount={this.handleMount}
        onSearch={this.handleSearch}
        onSearchSubmit={this.props.handleSearchSubmit}
        isLoading={isLoading}
        placeholder={placeHolder}
        linkComponent={linkComponent}
        searchSessionId={searchSessionId}
        isSendSearchTermsEnabled={isSendSearchTermsEnabled}
      >
        {getSearchResultsComponent({
          retrySearch: this.retrySearch,
          latestSearchQuery,
          isError,
          searchResults,
          isLoading,
          recentItems,
          keepPreQueryState,
          searchSessionId,
        })}
      </GlobalQuickSearch>
    );
  }
}
