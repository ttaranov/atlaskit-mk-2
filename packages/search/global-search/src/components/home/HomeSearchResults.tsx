import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import ConfluenceIcon from '@atlaskit/icon/glyph/confluence';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import { Result } from '../../model/Result';
import SearchError from '../SearchError';
import NoResults from '../NoResults';
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
    <ResultItemGroup title="Recently viewed" key="recent">
      {renderResults(results)}
    </ResultItemGroup>
  );
};

export const renderSearchPeopleItem = (query: string) =>
  searchPeopleItem({
    query: query,
    icon: <PeopleIcon size="medium" label="Search people" />,
    text: 'Search for more people',
  });

const renderSearchConfluenceItem = (query: string) =>
  searchConfluenceItem({
    query: query,
    icon: <ConfluenceIcon size="medium" label="Search confluence" />,
    text: 'Search for more Confluence pages and blogs',
    showKeyboardLozenge: false,
  });

const renderJira = (results: Result[], query: string) => (
  <ResultItemGroup title="Jira issues" key="jira">
    {renderResults(results)}
    {searchJiraItem(query)}
  </ResultItemGroup>
);

const renderConfluence = (results: Result[], query: string) => (
  <ResultItemGroup title="Confluence pages and blogs" key="confluence">
    {renderResults(results)}
    {renderSearchConfluenceItem(query)}
  </ResultItemGroup>
);

const renderPeople = (results: Result[], query: string) => (
  <ResultItemGroup title="People" key="people">
    {renderResults(results)}
    {renderSearchPeopleItem(query)}
  </ResultItemGroup>
);

const renderNoResults = (query: string) => [
  <NoResults key="no-results" />,
  <ResultItemGroup title="" key="advanced-search">
    {searchJiraItem(query)}
    {renderSearchConfluenceItem(query)}
    {renderSearchPeopleItem(query)}
  </ResultItemGroup>,
];

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
    return renderNoResults(query);
  }

  return [
    renderRecent(take(recentResults, 5)),
    renderJira(take(jiraResults, 5), query),
    renderConfluence(take(confluenceResults, 5), query),
    renderPeople(take(peopleResults, 3), query),
  ];
}
