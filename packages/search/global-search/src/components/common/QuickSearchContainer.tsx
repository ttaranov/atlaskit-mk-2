import * as React from 'react';
import * as uuid from 'uuid/v4';
import { InjectedIntl } from 'react-intl';
import { LinkComponent } from '../GlobalQuickSearchWrapper';
import GlobalQuickSearch from '../GlobalQuickSearch';
import performanceNow from '../../util/performance-now';
import { GenericResultObject } from '../../model/Result';

export interface SearchResultProps extends State {
  retrySearch: Function;
}

export interface Props {
  linkComponent?: LinkComponent;
  getSearchResultsComponent(state: SearchResultProps): React.ReactNode;
  getRecentItems(sessionId: string): Promise<GenericResultObject>;
  getSearchResults(
    query: string,
    sessionId: string,
    startTime: number,
  ): Promise<GenericResultObject | {}>;
  fireShownPreQueryEvent(
    searchSessionId: string,
    recentItems: GenericResultObject | {},
    requestStartTime?: number,
  ): void;
  fireShownPostQueryEvent(
    startTime: number,
    elapsedMs: number,
    searchResults: GenericResultObject | {},
    searchSessionId: string,
    latestSearchQuery: string,
  ): void;

  handleSearchSubmit?({ target: string }): void;
  isSendSearchTermsEnabled?: boolean;
  intl: InjectedIntl;
}

export interface State {
  latestSearchQuery: string;
  searchSessionId: string;
  isLoading: boolean;
  isError: boolean;
  keepPreQueryState: boolean;
  searchResults: object | null;
  recentItems: object | null;
}

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class QuickSearchContainer extends React.Component<Props, State> {
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
      const searchResults = await this.props.getSearchResults(
        query,
        this.state.searchSessionId,
        startTime,
      );

      const elapsedMs = performanceNow() - startTime;
      if (this.state.latestSearchQuery === query) {
        this.setState(
          {
            searchResults,
            isError: false,
            isLoading: false,
            keepPreQueryState: false,
          },
          () => {
            this.props.fireShownPostQueryEvent(
              startTime,
              elapsedMs,
              this.state.searchResults || {},
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
          this.props.fireShownPreQueryEvent(
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
      const recentItems = await this.props.getRecentItems(sessionId);
      this.setState(
        {
          recentItems,
          isLoading: false,
        },
        () =>
          this.props.fireShownPreQueryEvent(
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
        placeholder={this.props.intl.formatMessage({
          id: 'global-search.confluence.search-placeholder',
        })}
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
