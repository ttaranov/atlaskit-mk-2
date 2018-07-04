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
import SearchResult from './ConfluenceSearchResults';
import { LinkComponent } from '../GlobalQuickSearchWrapper';
import {
  redirectToConfluenceAdvancedSearch,
  handlePromiseError,
} from '../SearchResultsUtil';

export interface Props {
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  confluenceClient: ConfluenceClient;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
  linkComponent?: LinkComponent;
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
    if (this.state.query !== query) {
      this.setState({
        query: query,
        isLoading: true,
      });
    }

    if (query.length === 0) {
      // reset search results so that internal state between query and results stays consistent
      this.setState({
        isError: false,
        isLoading: false,
        objectResults: [],
        spaceResults: [],
        peopleResults: [],
      });
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

  doSearch = async (query: string) => {
    this.setState({
      isLoading: true,
    });
    const quickNavPromise = this.searchQuickNav(query).catch(error => {
      this.handleSearchErrorAnalytics(error, 'confluence.quicknav');
      // rethrow to fail the promise
      throw error;
    });
    const confXpSearchPromise = handlePromiseError(
      this.searchCrossProductConfluence(query),
      undefined,
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
        spaceResultsMap,
        peopleResults = [],
      ] = await Promise.all([
        quickNavPromise,
        confXpSearchPromise,
        searchPeoplePromise,
      ]);
      const searchResult =
        this.state.query === query
          ? {
              objectResults,
              spaceResults: spaceResultsMap
                ? spaceResultsMap.get(Scope.ConfluenceSpace) || []
                : [],
              peopleResults,
            }
          : {
              objectResults: this.state.objectResults,
              spaceResults: this.state.spaceResults,
              peopleResults: this.state.peopleResults,
            };

      this.setState({
        isError: false,
        isLoading: false,
        ...searchResult,
      });
    } catch {
      this.setState({ isError: true, isLoading: false });
    }
  };

  handleMount = async () => {
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
      this.setState({
        recentlyViewedPages,
        recentlyViewedSpaces,
        recentlyInteractedPeople,
        isLoading: false,
      });
    } catch {
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
        <SearchResult
          query={query}
          isError={isError}
          isLoading={isLoading}
          retrySearch={() => this.retrySearch()}
          recentlyViewedPages={recentlyViewedPages}
          recentlyViewedSpaces={recentlyViewedSpaces}
          recentlyInteractedPeople={recentlyInteractedPeople}
          objectResults={objectResults}
          spaceResults={spaceResults}
          peopleResults={peopleResults}
        />
      </GlobalQuickSearch>
    );
  }
}

export default withAnalytics(ConfluenceQuickSearchContainer, {}, {});
