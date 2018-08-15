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
} from './RecentActivities';
import AdvancedSearchGroup from '../confluence/AdvancedSearchGroup';

export const MAX_PAGES_BLOGS_ATTACHMENTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  renderNoResult: () => JSX.Element;
  renderAdvancedSearchLink: () => JSX.Element;
  retrySearch();
  getRecentlyViewedGroups: () => ResultsGroup[];
  getSearchResultsGroups: () => ResultsGroup[];
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
            advancedSearchLink={renderAdvancedSearchLink()}
            query={query}
            searchSessionId={searchSessionId}
            screenCounter={preQueryScreenCounter}
            referralContextIdentifiers={referralContextIdentifiers}
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
            renderAdvancedSearch={() => (
              <AdvancedSearchGroup key="advanced" query={query} />
            )}
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
