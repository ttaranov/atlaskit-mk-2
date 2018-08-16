import * as React from 'react';
import PreQueryState from './PreQueryState';
import { isEmpty } from '../SearchResultsUtil';
import SearchResults from '../SearchResults';
import { PostQueryAnalyticsComponent } from './ScreenAnalyticsHelper';
import { ScreenCounter } from '../../util/ScreenCounter';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import ResultGroupsComponent, {
  ResultsGroup,
  ResultGroupType,
} from './ResultGroupsComponent';

export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  renderNoResult: () => JSX.Element;
  renderAdvancedSearchLink: () => JSX.Element;
  retrySearch();
  getRecentlyViewedGroups: () => ResultsGroup[];
  getSearchResultsGroups: () => ResultsGroup[];
  renderAdvancedSearchGroup: () => JSX.Element;
  keepPreQueryState: boolean;
  searchSessionId: string;
  preQueryScreenCounter?: ScreenCounter;
  postQueryScreenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

export default class GenericSearchResults extends React.Component<Props> {
  render() {
    const {
      query,
      isError,
      isLoading,
      retrySearch,
      keepPreQueryState,
      searchSessionId,
      preQueryScreenCounter,
      postQueryScreenCounter,
      referralContextIdentifiers,
      getRecentlyViewedGroups,
      getSearchResultsGroups,
      renderNoResult,
      renderAdvancedSearchLink,
      renderAdvancedSearchGroup,
    } = this.props;

    return (
      <SearchResults
        retrySearch={retrySearch}
        query={query}
        isLoading={isLoading}
        isError={isError}
        keepPreQueryState={keepPreQueryState}
        renderPreQueryStateComponent={() => (
          <PreQueryState
            resultsGroup={getRecentlyViewedGroups()}
            renderAdvancedSearchLink={renderAdvancedSearchLink}
            query={query}
            searchSessionId={searchSessionId}
            screenCounter={preQueryScreenCounter}
            referralContextIdentifiers={referralContextIdentifiers}
            renderAdvancedSearchGroup={renderAdvancedSearchGroup}
          />
        )}
        shouldRenderNoResultsState={() =>
          getSearchResultsGroups()
            .map(({ items }) => items)
            .every(isEmpty)
        }
        renderNoResultsStateComponent={() => (
          <>
            {renderNoResult()}
            <PostQueryAnalyticsComponent
              screenCounter={postQueryScreenCounter}
              searchSessionId={searchSessionId}
              referralContextIdentifiers={referralContextIdentifiers}
              key="post-query-analytics"
            />
          </>
        )}
        renderSearchResultsStateComponent={() => (
          <ResultGroupsComponent
            type={ResultGroupType.PostQuery}
            renderAdvancedSearch={renderAdvancedSearchGroup}
            resultsGroup={getSearchResultsGroups()}
            searchSessionId={searchSessionId}
            screenCounter={postQueryScreenCounter}
            referralContextIdentifiers={referralContextIdentifiers}
          />
        )}
      />
    );
  }
}
