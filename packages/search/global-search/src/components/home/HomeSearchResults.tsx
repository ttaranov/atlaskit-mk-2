import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { Result } from '../../model/Result';
import SearchError from '../SearchError';
import EmptyState from '../EmptyState';
import {
  renderResults,
  searchConfluenceItem,
  searchJiraItem,
  searchPeopleItem,
  take,
  isEmpty,
} from '../SearchResultsUtil';

const renderRecent = (results: Result[]) => {
  if (isEmpty(results)) {
    return null;
  }

  return (
    <ResultItemGroup
      title="Recently viewed"
      key="recent"
      test-selector="recent"
    >
      {renderResults(results)}
    </ResultItemGroup>
  );
};

const renderJira = (results: Result[], query: string) => (
  <ResultItemGroup title="Jira issues" key="jira" test-selector="jira">
    {renderResults(results)}
    {searchJiraItem(query)}
  </ResultItemGroup>
);

const renderConfluence = (results: Result[], query: string) => (
  <ResultItemGroup
    title="Confluence pages and blogs"
    key="confluence"
    test-selector="confluence"
  >
    {renderResults(results)}
    {searchConfluenceItem(query)}
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

  if (query.length === 0) {
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
