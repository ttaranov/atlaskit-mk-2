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
} from '../SearchResults';

const renderObjects = (results: Result[], query: string) => (
  <ResultItemGroup
    title="Pages, blogs, attachments"
    key="confluence-objects"
    test-selector="confluence-objects"
  >
    {renderResults(results)}
  </ResultItemGroup>
);

const renderSpaces = (results: Result[], query: string) => (
  <ResultItemGroup
    title="Spaces"
    key="confluence-spaces"
    test-selector="confluence-spaces"
  >
    {renderResults(results)}
  </ResultItemGroup>
);

const renderPeople = (results: Result[], query: string) => (
  <ResultItemGroup title="People" key="people" test-selector="people">
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
    recentlyViewedPages,
    recentlyViewedSpaces,
    objectResults,
    spaceResults,
    peopleResults,
  } = props;

  if (isError) {
    return <SearchError onRetryClick={retrySearch} />;
  }

  if (query.length < 2) {
    // TODO render recent pages, recent spaces, recent people
    return ['pre-query state'];
  }

  // TODO need to pass isLoading down to avoid showing no results screen when still searching
  if ([objectResults, spaceResults, peopleResults].every(isEmpty)) {
    return renderEmptyState(query);
  }

  return [
    renderObjects(take(objectResults, 5), query),
    renderSpaces(take(spaceResults, 5), query),
    renderPeople(take(peopleResults, 3), query),
  ];
}
