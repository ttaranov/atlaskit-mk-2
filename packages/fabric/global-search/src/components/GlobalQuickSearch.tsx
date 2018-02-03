import * as React from 'react';

import { AkQuickSearch } from '@atlaskit/navigation';
import { Result } from '../model/Result';
import renderSearchResults from '../components/SearchResults';

export interface Props {
  getRecentlyViewedItems();
  onSearch(query: string);

  isLoading: boolean;
  query: string;
  recentlyViewedItems: Result[];
  recentResults: Result[];
  jiraResults: Result[];
  confluenceResults: Result[];
  peopleResults: Result[];
}

export default class GlobalQuickSearch extends React.Component<Props> {
  componentDidMount() {
    this.props.getRecentlyViewedItems();
  }

  handleSearchInput = ({ target }) => {
    const query = target.value;
    this.props.onSearch(query);
  };

  render() {
    const {
      query,
      isLoading,
      recentlyViewedItems,
      recentResults,
      jiraResults,
      confluenceResults,
      peopleResults,
    } = this.props;

    return (
      <AkQuickSearch
        isLoading={isLoading}
        onSearchInput={this.handleSearchInput}
        value={query}
      >
        {renderSearchResults({
          query,
          recentlyViewedItems,
          recentResults,
          jiraResults,
          confluenceResults,
          peopleResults,
        })}
      </AkQuickSearch>
    );
  }
}
