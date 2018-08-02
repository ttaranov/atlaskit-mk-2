import * as React from 'react';
import { Result } from '../../model/Result';
import NoResultsState from './NoResultsState';
import SearchResultsState from './SearchResultsState';
import PreQueryState from './PreQueryState';
import { isEmpty } from '../SearchResultsUtil';
import SearchResults from '../SearchResults';

export const MAX_OBJECTS = 8;
export const MAX_CONTAINERS = 3;
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
  recentObjects: Result[];
  recentContainers: Result[];
  recentlyInteractedPeople: Result[];
  objectResults: Result[];
  containerResults: Result[];
  peopleResults: Result[];
  keepPreQueryState: boolean;
  searchSessionId: string;
  preQueryScreenCounter?: ScreenCounter;
  postQueryScreenCounter?: ScreenCounter;
}

export default class ConfluenceSearchResults extends React.Component<Props> {
  render() {
    const {
      query,
      isError,
      objectResults,
      containerResults,
      peopleResults,
      isLoading,
      recentObjects,
      recentContainers,
      recentlyInteractedPeople,
      retrySearch,
      keepPreQueryState,
      searchSessionId,
      preQueryScreenCounter,
      postQueryScreenCounter,
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
            recentObjects={recentObjects}
            recentContainers={recentContainers}
            recentlyInteractedPeople={recentlyInteractedPeople}
            searchSessionId={searchSessionId}
            screenCounter={preQueryScreenCounter}
          />
        )}
        shouldRenderNoResultsState={() =>
          [objectResults, containerResults, peopleResults].every(isEmpty)
        }
        renderNoResultsStateComponent={() => <NoResultsState query={query} />}
        renderSearchResultsStateComponent={() => (
          <SearchResultsState
            query={query}
            objectResults={objectResults}
            containerResults={containerResults}
            peopleResults={peopleResults}
            searchSessionId={searchSessionId}
            screenCounter={postQueryScreenCounter}
          />
        )}
      />
    );
  }
}
