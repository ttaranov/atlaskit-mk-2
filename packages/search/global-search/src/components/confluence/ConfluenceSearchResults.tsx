import * as React from 'react';
import { ConfluenceResultsMap } from '../../model/Result';
import { ScreenCounter } from '../../util/ScreenCounter';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import NoResultsState from './NoResultsState';
import SearchResults from '../common/SearchResults';
import { getConfluenceAdvancedSearchLink } from '../SearchResultsUtil';
import { FormattedHTMLMessage } from 'react-intl';
import AdvancedSearchGroup from './AdvancedSearchGroup';
import {
  mapRecentResultsToUIGroups,
  mapSearchResultsToUIGroups,
} from './ConfluenceSearchResultsMapper';

export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  retrySearch();
  recentItems: ConfluenceResultsMap;
  searchResults: ConfluenceResultsMap;
  keepPreQueryState: boolean;
  searchSessionId: string;
  preQueryScreenCounter?: ScreenCounter;
  postQueryScreenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

export default class ConfluenceSearchResults extends React.Component<Props> {
  render() {
    const { recentItems, searchResults, query } = this.props;

    return (
      <SearchResults
        {...this.props}
        renderAdvancedSearchLink={() => (
          <FormattedHTMLMessage
            id="global-search.no-recent-activity-body"
            values={{ url: getConfluenceAdvancedSearchLink() }}
          />
        )}
        renderAdvancedSearchGroup={() => (
          <AdvancedSearchGroup key="advanced" query={query} />
        )}
        getRecentlyViewedGroups={() => mapRecentResultsToUIGroups(recentItems)}
        getSearchResultsGroups={() => mapSearchResultsToUIGroups(searchResults)}
        renderNoResult={() => <NoResultsState query={query} />}
      />
    );
  }
}
