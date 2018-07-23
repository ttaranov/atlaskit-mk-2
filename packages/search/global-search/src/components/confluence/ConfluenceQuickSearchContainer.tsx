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
import renderSearchResults, {
  MAX_PAGES_BLOGS_ATTACHMENTS,
  MAX_SPACES,
  MAX_PEOPLE,
  ScreenCounter,
} from './ConfluenceSearchResults';
import { LinkComponent } from '../GlobalQuickSearchWrapper';
import {
  redirectToConfluenceAdvancedSearch,
  handlePromiseError,
} from '../SearchResultsUtil';
import {
  ShownAnalyticsAttributes,
  buildShownEventDetails,
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
  isSendSearchTermsEnabled?: boolean;
}

class SearchScreenCounter implements ScreenCounter {
  count = 1;
  constructor() {
    this.count = 1;
  }

  getCount() {
    return this.count;
  }

  increment() {
    this.count++;
  }
}

export interface State {
  query: string;
  searchSessionId: string;
  isLoading: boolean;
  isError: boolean;
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
  recentlyInteractedPeople: Result[];
  objectResults: Result[];
  spaceResults: Result[];
  peopleResults: Result[];
  keepRecentActivityResults: boolean;
}

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class ConfluenceQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  preQueryScreenCounter: ScreenCounter;
  postQueryScreenCounter: ScreenCounter;

  constructor(props) {
    super(props);
    this.preQueryScreenCounter = new SearchScreenCounter();
    this.postQueryScreenCounter = new SearchScreenCounter();
  }

  state = {
    isLoading: false,
    isError: false,
    query: '',
    searchSessionId: uuid(), // unique id for search attribution
    recentlyViewedPages: [],
    recentlyViewedSpaces: [],
    recentlyInteractedPeople: [],
    objectResults: [],
    spaceResults: [],
    peopleResults: [],
    keepRecentActivityResults: true,
  };

  handleSearch = (query: string) => {
    if (this.state.query !== query) {
      this.setState({
        query: query,
        isLoading: true,
      });
    }

    if (query.length === 0) {
      // reset search results so that internal state between query and results stays consistent
      this.setState(
        {
          isError: false,
          isLoading: false,
          objectResults: [],
          spaceResults: [],
          peopleResults: [],
          keepRecentActivityResults: true,
        },
        () => this.fireShownPreQueryEvent(),
      );
    } else {
      this.doSearch(query);
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
    const results = await this.props.crossProductSearchClient.search(
      query,
      this.state.searchSessionId,
      [
        /*
        TEMPORARILY DISABLED: XPSRCH-861
        ----------------------------------
        Scope.ConfluencePageBlogAttachment,
        */
        Scope.ConfluenceSpace,
      ],
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
    requestStartTime: number,
    quickNavElapsedTime: number,
    resultsDetails: ShownAnalyticsAttributes,
  ) {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      const elapsedMs: number = performanceNow() - requestStartTime;

      firePostQueryShownEvent(
        resultsDetails,
        elapsedMs,
        quickNavElapsedTime,
        this.state.searchSessionId,
        this.state.query,
        createAnalyticsEvent,
      );
    }
  }
  getSearchResultState = (
    query: string,
    objectResults: Result[],
    spaceResults: Map<Scope, Result[]>,
    peopleResults: Result[],
  ) => {
    if (this.state.query === query) {
      return {
        objectResults,
        spaceResults: spaceResults.get(Scope.ConfluenceSpace) || [],
        peopleResults,
      };
    }
    return {
      objectResults: this.state.objectResults,
      spaceResults: this.state.spaceResults,
      peopleResults: this.state.peopleResults,
    };
  };

  doSearch = async (query: string) => {
    const startTime = performanceNow();
    let quickNavTime;

    this.setState({
      isLoading: true,
    });
    const quickNavPromise = this.searchQuickNav(query).catch(error => {
      this.handleSearchErrorAnalytics(error, 'confluence.quicknav');
      // rethrow to fail the promise
      throw error;
    });
    quickNavPromise.then(() => (quickNavTime = performanceNow() - startTime));
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

    try {
      const [
        objectResults,
        spaceResultsMap = new Map<Scope, Result[]>(),
        peopleResults = [],
      ] = await Promise.all([
        quickNavPromise,
        confXpSearchPromise,
        searchPeoplePromise,
      ]);

      const searchResult = this.getSearchResultState(
        query,
        objectResults,
        spaceResultsMap,
        peopleResults,
      );

      this.setState({
        isError: false,
        isLoading: false,
        keepRecentActivityResults: false,
        ...searchResult,
      });

      this.fireShownPostQueryEvent(
        startTime,
        quickNavTime,
        buildShownEventDetails(
          take(searchResult.objectResults, MAX_PAGES_BLOGS_ATTACHMENTS),
          take(searchResult.spaceResults, MAX_SPACES),
          take(searchResult.peopleResults, MAX_PEOPLE),
        ),
      );
    } catch {
      this.setState({
        isError: true,
        isLoading: false,
        keepRecentActivityResults: false,
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
    this.handleSearch(this.state.query);
  };

  render() {
    const { linkComponent, isSendSearchTermsEnabled } = this.props;
    const {
      query,
      isLoading,
      searchSessionId,
      isError,
      objectResults,
      spaceResults,
      peopleResults,
      recentlyViewedPages,
      recentlyViewedSpaces,
      recentlyInteractedPeople,
      keepRecentActivityResults,
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
        query={query}
        linkComponent={linkComponent}
        searchSessionId={searchSessionId}
        isSendSearchTermsEnabled={isSendSearchTermsEnabled}
      >
        {renderSearchResults({
          retrySearch: this.retrySearch,
          query,
          isError,
          objectResults,
          spaceResults,
          peopleResults,
          isLoading,
          recentlyViewedPages,
          recentlyViewedSpaces,
          recentlyInteractedPeople,
          keepRecentActivityResults,
          searchSessionId,
          screenCounters: {
            preQueryScreenCounter: this.preQueryScreenCounter,
            postQueryScreenCounter: this.postQueryScreenCounter,
          },
        })}
      </GlobalQuickSearch>
    );
  }
}

export default injectIntl<Props>(
  withAnalyticsEvents()(withAnalytics(ConfluenceQuickSearchContainer, {}, {})),
);
