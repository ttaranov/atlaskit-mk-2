import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { GlobalSearchResult } from '../../model/Result';
import SearchError from '../SearchError';
import NoResults from '../NoResults';
import {
  renderResults,
  searchConfluenceItem,
  searchPeopleItem,
  take,
  isEmpty,
} from '../SearchResultsUtil';

const renderObjectsGroup = (
  title: string,
  results: GlobalSearchResult[],
  query: string,
) =>
  results.length > 0 ? (
    <ResultItemGroup title={title} key="objects">
      {renderResults(results)}
    </ResultItemGroup>
  ) : null;

const renderSpacesGroup = (
  title: string,
  results: GlobalSearchResult[],
  query: string,
) =>
  results.length > 0 ? (
    <ResultItemGroup title={title} key="spaces">
      {renderResults(results)}
    </ResultItemGroup>
  ) : null;

const renderPeopleGroup = (
  title: string,
  results: GlobalSearchResult[],
  query: string,
) => (
  <ResultItemGroup title={title} key="people">
    {renderResults(results)}
    {renderSearchPeopleItem(query)}
  </ResultItemGroup>
);

export const renderSearchConfluenceItem = (query: string) =>
  searchConfluenceItem({
    query: query,
    icon: <SearchIcon size="medium" label="Advanced search" />,
    text: 'Advanced search for more filter options',
  });

const renderSearchPeopleItem = (query: string) =>
  searchPeopleItem({
    query: query,
    icon: <SearchIcon size="medium" label="Search People" />,
    text: 'People directory',
  });

const renderNoResults = (query: string) => [
  <NoResults key="no-results" />,
  <ResultItemGroup title="" key="advanced-search">
    {renderSearchConfluenceItem(query)}
    {renderSearchPeopleItem(query)}
  </ResultItemGroup>,
];

export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  retrySearch();
  recentlyViewedPages: GlobalSearchResult[];
  recentlyViewedSpaces: GlobalSearchResult[];
  recentlyInteractedPeople: GlobalSearchResult[];
  objectResults: GlobalSearchResult[];
  spaceResults: GlobalSearchResult[];
  peopleResults: GlobalSearchResult[];
}

export default function searchResults(props: Props) {
  const {
    query,
    isError,
    isLoading,
    retrySearch,
    recentlyViewedPages,
    recentlyViewedSpaces,
    recentlyInteractedPeople,
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
        take(recentlyViewedPages, 8),
        query,
      ),
      renderSpacesGroup('Recent spaces', take(recentlyViewedSpaces, 3), query),
      renderPeopleGroup('People', take(recentlyInteractedPeople, 3), query),
    ];
  }

  if ([objectResults, spaceResults, peopleResults].every(isEmpty)) {
    return renderNoResults(query);
  }

  return [
    renderObjectsGroup(
      'Pages, blogs and attachments',
      take(objectResults, 8),
      query,
    ),
    renderSpacesGroup('Spaces', take(spaceResults, 3), query),
    renderPeopleGroup('People', take(peopleResults, 3), query),
  ];
}
