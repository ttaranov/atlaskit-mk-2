import * as React from 'react';
import * as debounce from 'lodash.debounce';
import { withAnalytics, FireAnalyticsEvent } from '@atlaskit/analytics';
import GlobalQuickSearch from './GlobalQuickSearch';
import { RecentSearchClient } from '../api/RecentSearchClient';
import {
  CrossProductSearchClient,
  CrossProductResults,
} from '../api/CrossProductSearchClient';
import { Result } from '../model/Result';
import { PeopleSearchClient } from '../api/PeopleSearchClient';

export interface Props {
  recentSearchClient: RecentSearchClient;
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  debounceMillis?: number; // for testing only
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
}

export interface State {
  query: string;
  isLoading: boolean;
  recentlyViewedItems: Result[];
  recentResults: Result[];
  jiraResults: Result[];
  confluenceResults: Result[];
  peopleResults: Result[];
}

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class GlobalQuickSearchContainer extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    debounceMillis: 350,
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: false,
      query: '',
      recentlyViewedItems: [],
      recentResults: [],
      jiraResults: [],
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
        recentResults: [],
        jiraResults: [],
        confluenceResults: [],
      });
    } else {
      this.doDebouncedSearch(query);
    }
  };

  async searchRecent(query: string) {
    const results = await this.props.recentSearchClient.search(query);

    if (this.state.query === query) {
      this.setState({
        recentResults: results,
      });
    }

    return results;
  }

  async searchCrossProduct(query: string): Promise<CrossProductResults> {
    const results = await this.props.crossProductSearchClient.search(query);

    if (this.state.query === query) {
      this.setState({
        jiraResults: results.jira,
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

  doSearch = async (query: string) => {
    try {
      this.setState({
        isLoading: true,
      });

      await Promise.all([
        this.searchRecent(query),
        this.searchCrossProduct(query),
        this.searchPeople(query),
      ]);
    } catch (error) {
      // log error to analytics
      const { firePrivateAnalyticsEvent } = this.props;
      if (firePrivateAnalyticsEvent) {
        firePrivateAnalyticsEvent(
          'atlassian.fabric.global-search.search-error',
          {
            name: error.name,
            message: error.message,
          },
        );
      }
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  // leading:true so that we start searching as soon as the user typed in 2 characters since we don't search before that
  doDebouncedSearch = debounce(this.doSearch, this.props.debounceMillis, {
    leading: true,
  });

  handleGetRecentItems = async () => {
    this.setState({
      recentlyViewedItems: await this.props.recentSearchClient.getRecentItems(),
    });
  };

  render() {
    return (
      <GlobalQuickSearch
        getRecentlyViewedItems={this.handleGetRecentItems}
        onSearch={this.handleSearch}
        {...this.state}
      />
    );
  }
}

export default withAnalytics(GlobalQuickSearchContainer, {}, {});
