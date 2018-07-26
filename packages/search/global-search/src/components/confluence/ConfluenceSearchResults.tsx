import * as React from 'react';
import { Result } from '../../model/Result';
import SearchError from '../SearchError';
import NoResultsState from './NoResultsState';
import SearchResultsState from './SearchResultsState';
import PreQueryState from './PreQueryState';
import { isEmpty } from '../SearchResultsUtil';

export const MAX_PAGES_BLOGS_ATTACHMENTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

export interface ScreenCounter {
  getCount(): number;
  increment();
}

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
  screenCounters?: {
    preQueryScreenCounter: ScreenCounter;
    postQueryScreenCounter: ScreenCounter;
  };
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
      screenCounters,
    } = this.props;

    const { preQueryScreenCounter, postQueryScreenCounter } = screenCounters
      ? screenCounters
      : {
          preQueryScreenCounter: undefined,
          postQueryScreenCounter: undefined,
        };

    if (isError) {
      return <SearchError onRetryClick={retrySearch} />;
    }

    if (query.length === 0) {
      if (isLoading) {
        return null;
      }

      return (
        <PreQueryState
          query={query}
          recentlyViewedPages={recentlyViewedPages}
          recentlyViewedSpaces={recentlyViewedSpaces}
          recentlyInteractedPeople={recentlyInteractedPeople}
          searchSessionId={searchSessionId}
          screenCounter={preQueryScreenCounter}
        />
      );
    }

    if ([objectResults, spaceResults, peopleResults].every(isEmpty)) {
      if (isLoading && keepPreQueryState) {
        return (
          <PreQueryState
            query={query}
            recentlyViewedPages={recentlyViewedPages}
            recentlyViewedSpaces={recentlyViewedSpaces}
            recentlyInteractedPeople={recentlyInteractedPeople}
            searchSessionId={searchSessionId}
            screenCounter={preQueryScreenCounter}
          />
        );
      }

      return <NoResultsState query={query} />;
    }

    return (
      <SearchResultsState
        query={query}
        objectResults={objectResults}
        spaceResults={spaceResults}
        peopleResults={peopleResults}
        searchSessionId={searchSessionId}
        screenCounter={postQueryScreenCounter}
      />
    );
  }
}
