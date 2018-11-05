import * as React from 'react';
import * as uuid from 'uuid/v4';
import { LinkComponent, Logger } from '../GlobalQuickSearchWrapper';
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
  fireExperimentExposureEvent,
} from '../../util/analytics-event-helper';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { CreateAnalyticsEventFn } from '../analytics/types';
import { objectValues } from '../SearchResultsUtil';
import { ABTest } from '../../api/CrossProductSearchClient';

const resultMapToArray = (results: GenericResultMap): Result[][] =>
  objectValues(results).reduce((acc: Result[][], value) => [...acc, value], []);

export interface SearchResultProps extends State {
  retrySearch: Function;
}

export interface Props {
  logger: Logger;
  linkComponent?: LinkComponent;
  getSearchResultsComponent(state: SearchResultProps): React.ReactNode;
  getRecentItems(sessionId: string): Promise<ResultsWithTiming>;
  getSearchResults(
    query: string,
    sessionId: string,
    startTime: number,
  ): Promise<ResultsWithTiming>;
  getAbTestData(sessionId: string): Promise<ABTest | undefined>;

  /**
   * return displayed groups from result groups
   * Used by analytics to tell how many ui groups are displayed for user
   * for example in jira we pass (issues, boards, filters and projects but we display only 2 groups issues and others combined)
   * @param results
   */
  getDisplayedResults?(results: GenericResultMap | null): GenericResultMap;
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  handleSearchSubmit?(event: React.KeyboardEvent<HTMLInputElement>): void;
  isSendSearchTermsEnabled?: boolean;
  placeholder?: string;
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

const LOGGER_NAME = 'AK.GlobalSearch.QuickSearchContainer';
/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class QuickSearchContainer extends React.Component<Props, State> {
  static defaultProps = {
    getDisplayedResults: results => results || ({} as GenericResultMap),
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

  componentDidCatch(error, info) {
    this.props.logger.safeError(LOGGER_NAME, 'component did catch an error', {
      error,
      info,
      safeState: {
        searchSessionId: this.state.searchSessionId,
        latestSearchQuery: !!this.state.latestSearchQuery,
        isLoading: this.state.isLoading,
        isError: this.state.isError,
        keepPreQueryState: this.state.keepPreQueryState,
        recentItems: !!this.state.recentItems,
        searchResults: !!this.state.searchResults,
      },
    });

    this.setState({
      isError: true,
    });
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
    } catch (e) {
      this.props.logger.safeError(
        LOGGER_NAME,
        'error while getting search results',
        e,
      );
      this.setState({
        isError: true,
        isLoading: false,
        keepPreQueryState: false,
      });
    }
  };

  fireExperimentExposureEvent = async (searchSessionId: string) => {
    const { createAnalyticsEvent, getAbTestData, logger } = this.props;
    if (createAnalyticsEvent) {
      try {
        const abTest = await getAbTestData(searchSessionId);
        if (abTest) {
          fireExperimentExposureEvent(
            abTest,
            searchSessionId,
            createAnalyticsEvent,
          );
        }
      } catch (e) {
        logger.safeWarn(LOGGER_NAME, 'error while getting abtest data', e);
      }
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

      const resultsArray: Result[][] = resultMapToArray(
        getDisplayedResults(recentItems),
      );
      const eventAttributes: ShownAnalyticsAttributes = buildShownEventDetails(
        ...resultsArray,
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
      const resultsArray: Result[][] = resultMapToArray(
        getDisplayedResults(searchResults),
      );
      const resultsDetails: ShownAnalyticsAttributes = buildShownEventDetails(
        ...resultsArray,
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

    this.fireExperimentExposureEvent(this.state.searchSessionId);

    try {
      const { results } = await this.props.getRecentItems(
        this.state.searchSessionId,
      );
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
    } catch (e) {
      this.props.logger.safeError(
        LOGGER_NAME,
        'error while getting recent items',
        e,
      );
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
      placeholder,
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
        placeholder={placeholder}
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

export default withAnalyticsEvents()(QuickSearchContainer);
