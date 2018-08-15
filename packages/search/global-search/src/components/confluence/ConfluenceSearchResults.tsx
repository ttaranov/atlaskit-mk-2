import * as React from 'react';
import { Result } from '../../model/Result';
import NoResultsState from './NoResultsState';
import SearchResultsState from './SearchResultsState';
import PreQueryState from './PreQueryState';
import { isEmpty } from '../SearchResultsUtil';
import SearchResults from '../SearchResults';
import { PostQueryAnalyticsComponent } from '../common/ScreenAnalyticsHelper';
import { ScreenCounter } from '../../util/ScreenCounter';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';

export const MAX_PAGES_BLOGS_ATTACHMENTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  retrySearch();
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
  recentlyInteractedPeople: Result[];
  objectResults: Result[];
  spaceResults: Result[];
  peopleResults: Result[];
  keepPreQueryState: boolean;
  searchSessionId: string;
  preQueryScreenCounter?: ScreenCounter;
  postQueryScreenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
}

export default class ConfluenceSearchResults extends React.Component<Props> {
  render() {
    const {
      query,
      isError,
      objectResults,
      spaceResults,
      peopleResults,
      isLoading,
      recentlyViewedPages,
      recentlyViewedSpaces,
      recentlyInteractedPeople,
      retrySearch,
      keepPreQueryState,
      searchSessionId,
      preQueryScreenCounter,
      postQueryScreenCounter,
      referralContextIdentifiers,
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
            query={query}
            recentlyViewedPages={recentlyViewedPages}
            recentlyViewedSpaces={recentlyViewedSpaces}
            recentlyInteractedPeople={recentlyInteractedPeople}
            searchSessionId={searchSessionId}
            screenCounter={preQueryScreenCounter}
            referralContextIdentifiers={referralContextIdentifiers}
          />
        )}
        shouldRenderNoResultsState={() =>
          [objectResults, spaceResults, peopleResults].every(isEmpty)
        }
        renderNoResultsStateComponent={() => (
          <>
            <NoResultsState query={query} />
            <PostQueryAnalyticsComponent
              screenCounter={postQueryScreenCounter}
              searchSessionId={searchSessionId}
              referralContextIdentifiers={referralContextIdentifiers}
              key="post-query-analytics"
            />
          </>
        )}
        renderSearchResultsStateComponent={() => (
          <SearchResultsState
            query={query}
            objectResults={objectResults}
            spaceResults={spaceResults}
            peopleResults={peopleResults}
            searchSessionId={searchSessionId}
            screenCounter={postQueryScreenCounter}
            referralContextIdentifiers={referralContextIdentifiers}
          />
        )}
      />
    );
  }
}
