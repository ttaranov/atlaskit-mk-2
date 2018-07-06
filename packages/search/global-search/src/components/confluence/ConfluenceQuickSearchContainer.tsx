import * as React from 'react';
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
} from './ConfluenceSearchResults';
import settlePromises from '../../util/settle-promises';
import { LinkComponent } from '../GlobalQuickSearchWrapper';
import { redirectToConfluenceAdvancedSearch } from '../SearchResultsUtil';
import { GasPayload } from '@atlaskit/analytics-gas-types';
import {
  DEFAULT_GAS_CHANNEL,
  DEFAULT_GAS_SOURCE,
  DEFAULT_GAS_ATTRIBUTES,
  ShownAnalyticsAttributes,
  buildShownEventDetails,
  sanitizeSearchQuery,
} from '../../util/analytics';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { take } from '../SearchResultsUtil';

export interface Props {
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  confluenceClient: ConfluenceClient;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
  linkComponent?: LinkComponent;
  createAnalyticsEvent?: Function;
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
}

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class ConfluenceQuickSearchContainer extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
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
    };
  }

  handleSearch = (query: string) => {
    this.setState({
      query: query,
    });

    if (query.length === 0) {
      // reset search results so that internal state between query and results stays consistent
      this.setState(
        {
          isError: false,
          objectResults: [],
          spaceResults: [],
          peopleResults: [],
        },
        () => this.fireShownPreQueryAnalyticsEvent(),
      );
    } else {
      this.doSearch(query);
    }
  };

  handleSearchSubmit = () => {
    const { query } = this.state;
    redirectToConfluenceAdvancedSearch(query);
  };

  async searchQuickNav(query: string): Promise<Result[]> {
    const results = await this.props.confluenceClient.searchQuickNav(
      query,
      this.state.searchSessionId,
    );

    if (this.state.query === query) {
      this.setState({
        objectResults: results,
      });
    }

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

    if (this.state.query === query) {
      this.setState({
        /* 
        TEMPORARILY DISABLED: XPSRCH-861 
        ----------------------------------
        // objectResults: results.get(Scope.ConfluencePageBlogAttachment) || [],
        */

        spaceResults: results.get(Scope.ConfluenceSpace) || [],
      });
    }

    return results;
  }

  async searchPeople(query: string): Promise<Result[]> {
    const results = await this.props.peopleSearchClient.search(query);

    if (this.state.query === query) {
      this.setState({
        peopleResults: results,
      });
    }

    return results;
  }

  // TODO extract
  handleSearchErrorAnalytics(source: string) {
    return error => {
      const { firePrivateAnalyticsEvent } = this.props;

      if (firePrivateAnalyticsEvent) {
        firePrivateAnalyticsEvent(
          'atlassian.fabric.global-search.search-error',
          {
            name: error.name,
            message: error.message,
            source: source,
          },
        );
      }
    };
  }

  fireShownPreQueryAnalyticsEvent(requestStartTime?: Date) {
    const elapsedMs = requestStartTime
      ? new Date().getTime() - requestStartTime.getTime()
      : 0;

    const eventAttributes: ShownAnalyticsAttributes = buildShownEventDetails(
      take(this.state.recentlyViewedPages, MAX_PAGES_BLOGS_ATTACHMENTS),
      take(this.state.recentlyViewedSpaces, MAX_SPACES),
      take(this.state.recentlyInteractedPeople, MAX_PEOPLE),
    );

    if (this.props.createAnalyticsEvent) {
      const event = this.props.createAnalyticsEvent();
      const searchSessionId = this.state.searchSessionId;
      const payload: GasPayload = {
        action: 'shown',
        actionSubject: 'searchResults',
        actionSubjectId: 'preQuerySearchResults',
        eventType: 'ui',
        source: DEFAULT_GAS_SOURCE,
        attributes: {
          preQueryRequestDurationMs: elapsedMs,
          searchSessionId: searchSessionId,
          ...eventAttributes,
          ...DEFAULT_GAS_ATTRIBUTES,
        },
      };
      event.update(payload).fire(DEFAULT_GAS_CHANNEL);
    }
  }

  fireShownPostQueryAnalyticsEvent(
    requestStartTime: Date,
    resultsDetails: ShownAnalyticsAttributes,
  ) {
    const elapsedMs = new Date().getTime() - requestStartTime.getTime();

    if (this.props.createAnalyticsEvent) {
      const event = this.props.createAnalyticsEvent();
      const searchSessionId = this.state.searchSessionId;
      const sanitizedQuery = sanitizeSearchQuery(this.state.query);

      const payload: GasPayload = {
        action: 'shown',
        actionSubject: 'searchResults',
        actionSubjectId: 'postQuerySearchResults',
        eventType: 'ui',
        source: DEFAULT_GAS_SOURCE,
        attributes: {
          queryCharacterCount: sanitizedQuery.length,
          queryWordCount:
            sanitizedQuery.length > 0 ? sanitizedQuery.split(/\s/).length : 0,
          postQueryRequestDurationMs: elapsedMs,
          searchSessionId: searchSessionId,
          ...resultsDetails,
          ...DEFAULT_GAS_ATTRIBUTES,
        },
      };
      event.update(payload).fire(DEFAULT_GAS_CHANNEL);
    }
  }

  doSearch = async (query: string) => {
    const startTime = new Date();

    const quickNavPromise = this.searchQuickNav(query);
    const confXpSearchPromise = this.searchCrossProductConfluence(query);
    const searchPeoplePromise = this.searchPeople(query);

    // trigger error analytics when a search fails
    quickNavPromise.catch(
      this.handleSearchErrorAnalytics('confluence.quicknav'),
    );
    confXpSearchPromise.catch(
      this.handleSearchErrorAnalytics('xpsearch-confluence'),
    );
    searchPeoplePromise.catch(this.handleSearchErrorAnalytics('search-people'));

    /*
    * Handle error state
    */
    (async () => {
      try {
        await quickNavPromise;
        this.setState({
          isError: false,
        });
      } catch (e) {
        this.setState({
          isError: true,
        });
      }
    })();

    // handle loading state. true at the beginning, false only after all promises have settled.
    (async () => {
      try {
        this.setState({
          isLoading: true,
        });

        const [
          objectResults,
          spaceResultsMap,
          peopleResults,
        ] = await settlePromises([
          quickNavPromise,
          confXpSearchPromise,
          searchPeoplePromise,
        ]);

        // pull the space results out of the Map
        const spaceResults = spaceResultsMap.get(Scope.ConfluenceSpace) || [];

        this.fireShownPostQueryAnalyticsEvent(
          startTime,
          buildShownEventDetails(
            take(objectResults, MAX_PAGES_BLOGS_ATTACHMENTS),
            take(spaceResults, MAX_SPACES),
            take(peopleResults, MAX_PEOPLE),
          ),
        );
      } finally {
        this.setState({
          isLoading: false,
        });
      }
    })();
  };

  handleMount = async () => {
    const startTime = new Date();

    this.setState({
      isLoading: true,
    });

    const recentItemsPromise = this.props.confluenceClient.getRecentItems(
      this.state.searchSessionId,
    );
    const recentSpacesPromise = this.props.confluenceClient.getRecentSpaces(
      this.state.searchSessionId,
    );
    const recentPeoplePromise = this.props.peopleSearchClient.getRecentPeople();

    recentItemsPromise.catch(
      this.handleSearchErrorAnalytics('recent-confluence-items'),
    );
    recentSpacesPromise.catch(
      this.handleSearchErrorAnalytics('recent-confluence-spaces'),
    );
    recentPeoplePromise.catch(this.handleSearchErrorAnalytics('recent-people'));

    try {
      this.setState(
        {
          recentlyViewedPages: await recentItemsPromise,
          recentlyViewedSpaces: await recentSpacesPromise,
          recentlyInteractedPeople: await recentPeoplePromise,
        },
        () => this.fireShownPreQueryAnalyticsEvent(startTime),
      );
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  retrySearch = () => {
    this.handleSearch(this.state.query);
  };

  render() {
    const { linkComponent } = this.props;
    const {
      query,
      isLoading,
      isError,
      recentlyViewedPages,
      recentlyViewedSpaces,
      recentlyInteractedPeople,
      objectResults,
      spaceResults,
      peopleResults,
      searchSessionId,
    } = this.state;

    return (
      <GlobalQuickSearch
        onMount={this.handleMount}
        onSearch={this.handleSearch}
        onSearchSubmit={this.handleSearchSubmit}
        isLoading={isLoading}
        query={query}
        linkComponent={linkComponent}
        searchSessionId={searchSessionId}
      >
        {renderSearchResults({
          query,
          isError,
          isLoading,
          retrySearch: this.retrySearch,
          recentlyViewedPages,
          recentlyViewedSpaces,
          recentlyInteractedPeople,
          objectResults,
          spaceResults,
          peopleResults,
          searchSessionId,
        })}
      </GlobalQuickSearch>
    );
  }
}

export default withAnalyticsEvents()(
  withAnalytics(ConfluenceQuickSearchContainer, {}, {}),
);
