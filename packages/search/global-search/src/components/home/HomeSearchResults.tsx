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

const renderRecent = (results: Result[]) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <AkNavigationItemGroup
      title="Recently viewed"
      key="recent"
      test-selector="recent"
    >
      {resultsToComponents(results)}
    </AkNavigationItemGroup>
  );
};

const renderJira = (results: Result[], query: string) => (
  <AkNavigationItemGroup title="Jira issues" key="jira" test-selector="jira">
    {resultsToComponents(results)}
    {searchJiraItem(query)}
  </AkNavigationItemGroup>
);

const renderConfluence = (results: Result[], query: string) => (
  <AkNavigationItemGroup
    title="Confluence pages and blogs"
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
  recentlyViewedItems: Result[];
  recentResults: Result[];
  jiraResults: Result[];
  confluenceResults: Result[];
  peopleResults: Result[];
}

export default function searchResults(props: Props) {
  const {
    query,
    isError,
    retrySearch,
    recentlyViewedItems,
    recentResults,
    jiraResults,
    confluenceResults,
    peopleResults,
  } = props;

  if (isError) {
    return <SearchError onRetryClick={retrySearch} />;
  }

  if (query.length < 2) {
    return renderRecent(take(recentlyViewedItems, 10));
  }

  if (
    [recentResults, jiraResults, confluenceResults, peopleResults].every(
      isEmpty,
    )
  ) {
    return renderEmptyState(query);
  }

  return [
    renderRecent(take(recentResults, 5)),
    renderJira(take(jiraResults, 5), query),
    renderConfluence(take(confluenceResults, 5), query),
    renderPeople(take(peopleResults, 3), query),
  ];
}
