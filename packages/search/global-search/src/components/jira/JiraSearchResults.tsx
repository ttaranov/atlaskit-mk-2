import * as React from 'react';
import { JiraResultsMap, GenericResultObject } from '../../model/Result';
import { ScreenCounter } from '../../util/ScreenCounter';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import SearchResults from '../common/SearchResults';
import { FormattedHTMLMessage } from 'react-intl';
import NoResultsState from './NoResultsState';
import {
  mapRecentResultsToUIGroups,
  mapSearchResultsToUIGroups,
} from './JiraSearchResultsMapper';
export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  retrySearch();
  searchResults: GenericResultObject;
  recentItems: JiraResultsMap;
  keepPreQueryState: boolean;
  searchSessionId: string;
  preQueryScreenCounter?: ScreenCounter;
  postQueryScreenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

export default class JiraSearchResults extends React.Component<Props> {
  render() {
    const { recentItems, searchResults, query } = this.props;

    return (
      <SearchResults
        {...this.props}
        renderAdvancedSearchLink={() => (
          <FormattedHTMLMessage
            id="global-search.no-recent-activity-body"
            values={{ url: 'http://www.jdog.jira-dev.com' }}
          />
        )}
        renderAdvancedSearchGroup={() => (
          <a href="#" key="jira-advanced-search">
            Search JIRA
          </a>
        )}
        getRecentlyViewedGroups={() => mapRecentResultsToUIGroups(recentItems)}
        getSearchResultsGroups={() =>
          mapSearchResultsToUIGroups(searchResults as JiraResultsMap)
        }
        renderNoResult={() => <NoResultsState query={query} />}
      />
    );
  }
}
