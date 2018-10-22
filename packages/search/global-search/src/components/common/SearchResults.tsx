import * as React from 'react';
import PreQueryState from './PreQueryState';
import { isEmpty } from '../SearchResultsUtil';
import { PostQueryAnalyticsComponent } from './ScreenAnalyticsHelper';
import { ScreenCounter } from '../../util/ScreenCounter';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import ResultGroupsComponent, {
  ResultGroupType,
} from './ResultGroupsComponent';
import { ResultsGroup } from '../../model/Result';
import SearchError from '../SearchError';

export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  renderNoResult: () => JSX.Element;
  renderNoRecentActivity: () => JSX.Element;
  renderBeforePreQueryState?: () => JSX.Element;
  retrySearch();
  getPreQueryGroups: () => ResultsGroup[];
  getPostQueryGroups: () => ResultsGroup[];
  renderAdvancedSearchGroup: (analyticsData?) => JSX.Element;
  keepPreQueryState: boolean;
  searchSessionId: string;
  preQueryScreenCounter?: ScreenCounter;
  postQueryScreenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

export default class SearchResults extends React.Component<Props> {
  hasNoResult() {
    return this.props
      .getPostQueryGroups()
      .map(({ items }) => items)
      .every(isEmpty);
  }

  renderNoResult() {
    const {
      renderNoResult,
      postQueryScreenCounter,
      searchSessionId,
      referralContextIdentifiers,
    } = this.props;
    return (
      <>
        {renderNoResult()}
        <PostQueryAnalyticsComponent
          screenCounter={postQueryScreenCounter}
          searchSessionId={searchSessionId}
          referralContextIdentifiers={referralContextIdentifiers}
          key="post-query-analytics"
        />
      </>
    );
  }

  renderPreQueryState() {
    const {
      query,
      searchSessionId,
      preQueryScreenCounter,
      renderNoRecentActivity,
      referralContextIdentifiers,
      renderBeforePreQueryState,
      renderAdvancedSearchGroup,
      getPreQueryGroups,
    } = this.props;
    return (
      <>
        {renderBeforePreQueryState && renderBeforePreQueryState()}
        <PreQueryState
          resultsGroups={getPreQueryGroups()}
          renderNoRecentActivity={renderNoRecentActivity}
          query={query}
          searchSessionId={searchSessionId}
          screenCounter={preQueryScreenCounter}
          referralContextIdentifiers={referralContextIdentifiers}
          renderAdvancedSearchGroup={renderAdvancedSearchGroup}
        />
      </>
    );
  }

  renderSearchResultsState() {
    const {
      searchSessionId,
      referralContextIdentifiers,
      renderAdvancedSearchGroup,
      getPostQueryGroups,
      postQueryScreenCounter,
    } = this.props;
    return (
      <ResultGroupsComponent
        type={ResultGroupType.PostQuery}
        renderAdvancedSearch={renderAdvancedSearchGroup}
        resultsGroups={getPostQueryGroups()}
        searchSessionId={searchSessionId}
        screenCounter={postQueryScreenCounter}
        referralContextIdentifiers={referralContextIdentifiers}
      />
    );
  }

  render() {
    const {
      query,
      isError,
      isLoading,
      retrySearch,
      keepPreQueryState,
    } = this.props;

    if (isError) {
      return <SearchError onRetryClick={retrySearch} />;
    }

    if (query.length === 0) {
      if (isLoading) {
        return null;
      }

      return this.renderPreQueryState();
    }

    // the state when the user starts typing from the pre query screen while we are waiting for search results
    if (isLoading && keepPreQueryState) {
      return this.renderPreQueryState();
    }

    if (this.hasNoResult()) {
      return this.renderNoResult();
    }

    return this.renderSearchResultsState();
  }
}
