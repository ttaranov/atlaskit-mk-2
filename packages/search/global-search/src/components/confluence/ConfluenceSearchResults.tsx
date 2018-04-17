import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { Result } from '../../model/Result';
import SearchError from '../SearchError';
import EmptyState from '../EmptyState';
import {
  renderResults,
  searchConfluenceItem,
  searchPeopleItem,
  take,
  isEmpty,
} from '../SearchResultsUtil';

const renderObjectsGroup = (
  title: string,
  results: Result[],
  query: string,
) => (
  <ResultItemGroup title={title} key="objects">
    {renderResults(results)}
  </ResultItemGroup>
);

const renderSpacesGroup = (title: string, results: Result[], query: string) => (
  <ResultItemGroup title={title} key="spaces">
    {renderResults(results)}
  </ResultItemGroup>
);

const renderPeopleGroup = (title: string, results: Result[], query: string) => (
  <ResultItemGroup title={title} key="people">
    {renderResults(results)}
    {searchPeopleItem()}
  </ResultItemGroup>
);

const renderEmptyState = (query: string) => (
  <>
    <EmptyState />
    {searchConfluenceItem(query)}
    {searchPeopleItem()}
  </>
);

export interface Props {
  query: string;
  isError: boolean;
  retrySearch();
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
  objectResults: Result[];
  spaceResults: Result[];
  peopleResults: Result[];
}

export default function searchResults(props: Props) {
  const {
    query,
    isError,
    retrySearch,
    // @ts-ignore unused
    recentlyViewedPages,
    // @ts-ignore unused
    recentlyViewedSpaces,
    objectResults,
    spaceResults,
    peopleResults,
  } = props;

  if (isError) {
    return <SearchError onRetryClick={retrySearch} />;
  }

  if (query.length === 0) {
    return [
      renderObjectsGroup('Recent pages and blogs', recentlyViewedPages, query),
      renderSpacesGroup('Recent spaces', recentlyViewedSpaces, query),
    ];
  }

  // TODO need to pass isLoading down to avoid showing no results screen when still searching
  if ([objectResults, spaceResults, peopleResults].every(isEmpty)) {
    return renderEmptyState(query);
  }

  return [
    renderObjectsGroup('Objects', take(objectResults, 5), query),
    renderSpacesGroup('Spaces', take(spaceResults, 5), query),
    renderPeopleGroup('People', take(peopleResults, 3), query),
  ];
}
