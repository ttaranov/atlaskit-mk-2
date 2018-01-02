import * as React from 'react';
import * as debounce from 'lodash.debounce';
import GlobalQuickSearch from './GlobalQuickSearch';

import { RecentSearchProvider } from '../api/RecentSearchProvider';
import { CrossProductSearchProvider } from '../api/CrossProductSearchProvider';
import { Result } from '../model/Result';

export interface Props {
  recentSearchProvider: RecentSearchProvider;
  crossProductSearchProvider: CrossProductSearchProvider;
}

export interface State {
  query: string;
  isLoading: boolean;
  recentlyViewedItems: Result[];
  recentResults: Result[];
  jiraResults: Result[];
  confluenceResults: Result[];
}

export default class GlobalQuickSearchContainer extends React.Component<
  Props,
  State
> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isLoading: false,
      query: '',
      recentlyViewedItems: [],
      recentResults: [],
      jiraResults: [],
      confluenceResults: [],
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

  doSearch = async (query: string) => {
    this.setState({
      isLoading: true,
    });

    const recentSearch = this.props.recentSearchProvider.search(query);
    const crossProductSearch = this.props.crossProductSearchProvider.search(
      query,
    );

    try {
      this.setState({
        recentResults: await recentSearch,
      });

      this.setState({
        jiraResults: (await crossProductSearch).jira,
        confluenceResults: (await crossProductSearch).confluence,
      });
    } catch (error) {
      // something bad happened. handle it. analytics
      // console.error('ERROR ERROR ERROR', error);
    } finally {
      this.setState({
        isLoading: false,
      });
    }
  };

  // leading so that we start searching as soon as the user typed in 2 characters since we don't search before that
  doDebouncedSearch = debounce(this.doSearch, 150, { leading: true });

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
