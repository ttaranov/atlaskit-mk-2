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

const renderRecent = (results: Result[], sectionIndex: number) => {
  if (isEmpty(results)) {
    return null;
  }

  return (
    <ResultItemGroup title="Recently viewed" key="recent">
      {renderResults(results, sectionIndex)}
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

const renderJira = (results: Result[], query: string, sectionIndex: number) => (
  <ResultItemGroup title="Jira issues" key="jira">
    {renderResults(results, sectionIndex)}
    {searchJiraItem(query)}
  </ResultItemGroup>
);

const renderConfluence = (
  results: Result[],
  query: string,
  sectionIndex: number,
) => (
  <ResultItemGroup title="Confluence pages and blogs" key="confluence">
    {renderResults(results, sectionIndex)}
    {renderSearchConfluenceItem(query)}
  </ResultItemGroup>
);

const renderPeople = (
  results: Result[],
  query: string,
  sectionIndex: number,
) => (
  <ResultItemGroup title="People" key="people">
    {renderResults(results, sectionIndex)}
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
    return renderRecent(take(recentlyViewedItems, 10), 0);
  }

  if (
    [recentResults, jiraResults, confluenceResults, peopleResults].every(
      isEmpty,
    )
  ) {
    return renderNoResults(query);
  }

  let sectionIndex = 0;
  const renderedRecent = renderRecent(take(recentResults, 5), sectionIndex);
  if (renderedRecent !== null) {
    sectionIndex++;
  }

  const renderedJira = renderJira(take(jiraResults, 5), query, sectionIndex);
  if (renderedJira !== null) {
    sectionIndex++;
  }

  const renderedConfluence = renderConfluence(
    take(confluenceResults, 5),
    query,
    sectionIndex,
  );
  if (renderedConfluence !== null) {
    sectionIndex++;
  }

  const renderedPeople = renderPeople(
    take(peopleResults, 3),
    query,
    sectionIndex,
  );

  return [renderedRecent, renderedJira, renderedConfluence, renderedPeople];
}
