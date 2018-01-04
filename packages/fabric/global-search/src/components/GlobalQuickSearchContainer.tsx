import * as React from 'react';
import * as debounce from 'lodash.debounce';
import GlobalQuickSearch from './GlobalQuickSearch';

import { RecentSearchProvider } from '../api/RecentSearchProvider';
import {
  CrossProductSearchProvider,
  CrossProductResults,
} from '../api/CrossProductSearchProvider';
import { Result } from '../model/Result';
import { PeopleSearchProvider } from '../api/PeopleSearchProvider';

export interface Props {
  recentSearchProvider: RecentSearchProvider;
  crossProductSearchProvider: CrossProductSearchProvider;
  peopleSearchProvider: PeopleSearchProvider;
  debounceMillis?: number; // for testing only
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

export default class GlobalQuickSearchContainer extends React.Component<
  Props,
  State
> {
  static defaultProps: Partial<Props> = {
    debounceMillis: 150,
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
    const results = await this.props.recentSearchProvider.search(query);

    if (this.state.query === query) {
      this.setState({
        recentResults: results,
      });
    }

    return results;
  }

  async searchCrossProduct(query: string): Promise<CrossProductResults> {
    const results = await this.props.crossProductSearchProvider.search(query);

    if (this.state.query === query) {
      this.setState({
        jiraResults: results.jira,
        confluenceResults: results.confluence,
      });
    }

    return results;
  }

  async searchPeople(query: string): Promise<Result[]> {
    const results = await this.props.peopleSearchProvider.search(query);

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
      // something bad happened. handle it. analytics
      // console.error('ERROR ERROR ERROR', error);
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
      recentlyViewedItems: await this.props.recentSearchProvider.getRecentItems(),
    });
  };

  render() {
    return (
      <GlobalQuickSearch
        getRecentlyViewedItems={this.handleGetRecentItems}
        search={this.handleSearch}
        {...this.state}
      />
    );
  }
}
