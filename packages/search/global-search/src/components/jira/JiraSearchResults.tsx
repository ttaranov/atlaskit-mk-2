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
    const { recentItems, searchResults, query } = this.props;

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
        renderAdvancedSearchGroup={() => (
          <StickyFooter>
            <JiraAdvancedSearch
              query={query}
              showKeyboardLozenge
              showSearchIcon
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
