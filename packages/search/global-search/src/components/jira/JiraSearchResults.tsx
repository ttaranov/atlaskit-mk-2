import * as React from 'react';
import {
  Result,
  ResultsGroup,
  JiraRecentlyViewedItemsMap,
  GenericResultObject,
} from '../../model/Result';
import { ScreenCounter } from '../../util/ScreenCounter';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import { take } from '../SearchResultsUtil';
import GenericSearchResults from '../common/GenericSearchResults';
import { FormattedHTMLMessage } from 'react-intl';

export const MAX_ISSUES = 8;
export const MAX_PROJECTS = 2;
export const MAX_BOARDS = 2;
export const MAX_FILTERS = 2;

export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  retrySearch();
  searchResults: GenericResultObject;
  recentItems: JiraRecentlyViewedItemsMap;
  keepPreQueryState: boolean;
  searchSessionId: string;
  preQueryScreenCounter?: ScreenCounter;
  postQueryScreenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

const getRecentsResultGroups = (recentlyViewedObjects): ResultsGroup[] => {
  const {
    issues = [],
    boards = [],
    projects = [],
    filters = [],
  } = recentlyViewedObjects;

  const [issuesToDisplay, ...others] = [
    [issues, MAX_ISSUES],
    [boards, MAX_BOARDS],
    [filters, MAX_FILTERS],
    [projects, MAX_PROJECTS],
  ].map(([items, count]) => take(items, count));

  return [
    {
      items: issuesToDisplay as Result[],
      key: 'issues',
      titleI18nId: 'global-search.jira.recent-issues-heading',
    },
    {
      items: others.reduce((acc, arr) => [...acc, ...arr]) as Result[],
      key: 'containers',
      titleI18nId: 'global-search.jira.recent-containers',
    },
  ];
};

const getSearchResultsGroup = (searchResultsObjects): ResultsGroup[] => {
  return [];
};

export default class JiraSearchResults extends React.Component<Props> {
  render() {
    const { recentItems, searchResults, query } = this.props;

    return (
      <GenericSearchResults
        {...this.props}
        renderAdvancedSearchLink={() => (
          <FormattedHTMLMessage
            id="global-search.no-recent-activity-body"
            values={{ url: 'http://www.jdog.jira-dev.com' }}
          />
        )}
        renderAdvancedSearchGroup={() => (
          <div id="jira-advanced-search" key="jira-advanced-search" />
        )}
        getRecentlyViewedGroups={() => getRecentsResultGroups(recentItems)}
        getSearchResultsGroups={() => getSearchResultsGroup(searchResults)}
        renderNoResult={() => <div id="no-result" key={query} />}
      />
    );
  }
}
