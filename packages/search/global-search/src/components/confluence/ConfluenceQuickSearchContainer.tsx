import * as React from 'react';
import * as debounce from 'lodash.debounce';
import { withAnalytics, FireAnalyticsEvent } from '@atlaskit/analytics';
import * as uuid from 'uuid/v4';
import GlobalQuickSearch from '../GlobalQuickSearch';
import { ConfluenceSearchClient } from '../../api/ConfluenceSearchClient';
import {
  CrossProductSearchClient,
  CrossProductResults,
} from '../../api/CrossProductSearchClient';
import { Result } from '../../model/Result';
import { PeopleSearchClient } from '../../api/PeopleSearchClient';
import renderSearchResults from './ConfluenceSearchResults';

export interface Props {
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  confluenceSearchClient: ConfluenceSearchClient;
  debounceMillis?: number; // for testing only
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
}

export interface State {
  query: string;
  searchSessionId: string;
  isLoading: boolean;
  isError: boolean;
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
  confluenceResults: Result[];
  peopleResults: Result[];
}

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class ConfluenceQuickSearchContainer extends React.Component<
  Props,
  State
> {
  static defaultProps: Partial<Props> = {
    debounceMillis: 350,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: false,
      isError: false,
      query: '',
      searchSessionId: uuid(), // unique id for search attribution
      recentlyViewedPages: [],
      recentlyViewedSpaces: [],
      confluenceResults: [],
      peopleResults: [],
    };
  }

  handleSearch = (query: string) => {
    this.setState({
      query: query,
    });

    if (query.length < 2) {
      // reset search results so that internal state between query and results stays consistent
      this.setState({
        isError: false,
        confluenceResults: [],
        peopleResults: [],
      });
    } else {
      this.doDebouncedSearch(query);
    }
  };

  async searchCrossProduct(query: string): Promise<CrossProductResults> {
    const results = await this.props.crossProductSearchClient.search(
      query,
      this.state.searchSessionId,
    );

    if (this.state.query === query) {
      this.setState({
        confluenceResults: results.confluence,
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

  doSearch = async (query: string) => {
    const searchCrossProductPromise = this.searchCrossProduct(query);
    const searchPeoplePromise = this.searchPeople(query);

    // trigger error analytics when a search fails
    searchCrossProductPromise.catch(
      this.handleSearchErrorAnalytics('xpsearch'),
    );
    searchPeoplePromise.catch(this.handleSearchErrorAnalytics('people'));

    /*
    * Handle error state
    */
    (async () => {
      try {
        await searchCrossProductPromise;
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

        await Promise.all(
          [searchCrossProductPromise, searchPeoplePromise].map(p =>
            p.catch(Error),
          ),
        );
      } finally {
        this.setState({
          isLoading: false,
        });
      }
    })();
  };

  // leading:true so that we start searching as soon as the user typed in 2 characters since we don't search before that
  doDebouncedSearch = debounce(this.doSearch, this.props.debounceMillis, {
    leading: true,
  });

  handleMount = async () => {
    this.setState({
      recentlyViewedPages: await this.props.confluenceSearchClient.getRecentPages(),
      recentlyViewedSpaces: await this.props.confluenceSearchClient.getRecentSpaces(),
    });
  };

  retrySearch = () => {
    this.handleSearch(this.state.query);
  };

  render() {
    const {
      query,
      isLoading,
      isError,
      recentlyViewedPages,
      recentlyViewedSpaces,
      confluenceResults,
      peopleResults,
    } = this.state;

    return (
      <GlobalQuickSearch
        onMount={this.handleMount}
        onSearch={this.handleSearch}
        isLoading={isLoading}
        query={query}
      >
        {renderSearchResults({
          query,
          isError,
          retrySearch: this.retrySearch,
          recentlyViewedPages,
          recentlyViewedSpaces,
          confluenceResults,
          peopleResults,
        })}
      </GlobalQuickSearch>
    );
  }
}

export default withAnalytics(ConfluenceQuickSearchContainer, {}, {});
