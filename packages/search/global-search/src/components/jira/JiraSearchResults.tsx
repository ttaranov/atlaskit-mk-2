import * as React from 'react';
import styled from 'styled-components';
import { FormattedHTMLMessage } from 'react-intl';
import { colors, gridSize } from '@atlaskit/theme';
import { JiraResultsMap, GenericResultMap } from '../../model/Result';
import { ScreenCounter } from '../../util/ScreenCounter';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import SearchResults from '../common/SearchResults';
import NoResultsState from './NoResultsState';
import JiraAdvancedSearch from './JiraAdvancedSearch';
import { JiraEntityTypes } from '../SearchResultsUtil';
import {
  mapRecentResultsToUIGroups,
  mapSearchResultsToUIGroups,
} from './JiraSearchResultsMapper';
export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  retrySearch();
  searchResults: GenericResultMap;
  recentItems: JiraResultsMap;
  keepPreQueryState: boolean;
  searchSessionId: string;
  preQueryScreenCounter?: ScreenCounter;
  postQueryScreenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
  onAdvancedSearchChange?(jiraEntityType: JiraEntityTypes): void;
}

const StickyFooter = styled.div`
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid ${colors.N40};
  padding: ${gridSize()}px 0;
`;

const AdvancedSearchContainer = styled.div`
  margin-top: ${4 * gridSize()}px;
`;

export default class JiraSearchResults extends React.Component<Props> {
  render() {
    const {
      recentItems,
      searchResults,
      query,
      onAdvancedSearchChange,
    } = this.props;

    return (
      <SearchResults
        {...this.props}
        renderNoRecentActivity={() => (
          <>
            <FormattedHTMLMessage id="global-search.jira.no-recent-activity-body" />
            <AdvancedSearchContainer>
              <JiraAdvancedSearch query={query} />
            </AdvancedSearchContainer>
          </>
        )}
        renderAdvancedSearchGroup={(analyticsData?) => (
          <StickyFooter>
            <JiraAdvancedSearch
              analyticsData={analyticsData}
              query={query}
              showKeyboardLozenge
              showSearchIcon
              onAdvancedSearchChange={onAdvancedSearchChange}
            />
          </StickyFooter>
        )}
        getPreQueryGroups={() => mapRecentResultsToUIGroups(recentItems)}
        getPostQueryGroups={() =>
          mapSearchResultsToUIGroups(searchResults as JiraResultsMap)
        }
        renderNoResult={() => <NoResultsState query={query} />}
      />
    );
  }
}
