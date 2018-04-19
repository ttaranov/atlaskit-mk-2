import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { ClientResult } from '../../model/ClientResult';
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
  results: ClientResult[],
  query: string,
) => (
  <ResultItemGroup title={title} key="objects">
    {renderResults(results)}
  </ResultItemGroup>
);

const renderSpacesGroup = (
  title: string,
  results: ClientResult[],
  query: string,
) => (
  <ResultItemGroup title={title} key="spaces">
    {renderResults(results)}
  </ResultItemGroup>
);

const renderPeopleGroup = (
  title: string,
  results: ClientResult[],
  query: string,
) => (
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
  isLoading: boolean;
  retrySearch();
  recentlyViewedPages: ClientResult[];
  recentlyViewedSpaces: ClientResult[];
  objectResults: ClientResult[];
  spaceResults: ClientResult[];
  peopleResults: ClientResult[];
}

export default function searchResults(props: Props) {
  const {
    query,
    isError,
    isLoading,
    retrySearch,
    // @ts-ignore unused
    recentlyViewedPages,
    // @ts-ignore unused
    recentlyViewedSpaces,
    objectResults,
    spaceResults,
    peopleResults,
  } = props;

  if (isLoading) {
    return null; // better than showing empty error, but worth some more thought.
  }

  if (isError) {
    return <SearchError onRetryClick={retrySearch} />;
  }

  if (query.length === 0) {
    return [
      renderObjectsGroup(
        'Recent pages and blogs',
        take(recentlyViewedPages, 5),
        query,
      ),
      renderSpacesGroup('Recent spaces', take(recentlyViewedSpaces, 5), query),
    ];
  }

  if ([objectResults, spaceResults, peopleResults].every(isEmpty)) {
    return renderEmptyState(query);
  }

  return [
    renderObjectsGroup('Objects', take(objectResults, 5), query),
    renderSpacesGroup('Spaces', take(spaceResults, 5), query),
    renderPeopleGroup('People', take(peopleResults, 3), query),
  ];
}
