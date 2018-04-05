import * as React from 'react';
import { AkNavigationItemGroup } from '@atlaskit/navigation';
import { Result } from '../../model/Result';
import SearchError from '../SearchError';
import EmptyState from '../EmptyState';
import {
  resultsToComponents,
  searchConfluenceItem,
  searchJiraItem,
  searchPeopleItem,
  take,
  isEmpty,
} from '../SearchResults';

const renderConfluence = (results: Result[], query: string) => (
  <AkNavigationItemGroup
    title="Pages, blogs, attachments"
    key="confluence"
    test-selector="confluence"
  >
    {resultsToComponents(results)}
    {searchConfluenceItem(query)}
  </AkNavigationItemGroup>
);

const renderPeople = (results: Result[], query: string) => (
  <AkNavigationItemGroup title="People" key="people" test-selector="people">
    {resultsToComponents(results)}
    {searchPeopleItem()}
  </AkNavigationItemGroup>
);

const renderEmptyState = (query: string) => (
  <>
    <EmptyState />
    {searchJiraItem(query)}
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
  confluenceResults: Result[];
  peopleResults: Result[];
}

export default function searchResults(props: Props) {
  const {
    query,
    isError,
    retrySearch,
    recentlyViewedPages,
    recentlyViewedSpaces,
    confluenceResults,
    peopleResults,
  } = props;

  if (isError) {
    return <SearchError onRetryClick={retrySearch} />;
  }

  if (query.length < 2) {
    // TODO render recent pages, recent spaces, recent people
    return [];
  }

  if ([confluenceResults, peopleResults].every(isEmpty)) {
    return renderEmptyState(query);
  }

  return [
    renderConfluence(take(confluenceResults, 5), query),
    renderPeople(take(peopleResults, 3), query),
  ];
}
