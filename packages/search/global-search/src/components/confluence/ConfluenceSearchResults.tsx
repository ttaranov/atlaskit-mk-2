import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { Result } from '../../model/Result';
import SearchError from '../SearchError';
import NoResults from '../NoResults';
import {
  renderResults,
  searchConfluenceItem,
  searchPeopleItem,
  take,
  isEmpty,
} from '../SearchResultsUtil';
import ShownSearchResultsTrackEvent from '../analytics/ShownSearchResultsTrackEvent';

const renderObjectsGroup = (title: string, results: Result[], query: string) =>
  results.length > 0 ? (
    <ResultItemGroup title={title} key="objects">
      {renderResults(results)}
    </ResultItemGroup>
  ) : null;

const renderSpacesGroup = (title: string, results: Result[], query: string) =>
  results.length > 0 ? (
    <ResultItemGroup title={title} key="spaces">
      {renderResults(results)}
    </ResultItemGroup>
  ) : null;

const renderPeopleGroup = (title: string, results: Result[], query: string) => (
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

const ShownPreQueryResultsEvent = (results: Result[]) => (
  <ShownSearchResultsTrackEvent
    key="ShownPreQueryDrawerScreenEvent"
    action="viewed"
    actionSubject="preQuerySearchResults"
  />
);

const ShownPostQueryResultsEvent = (results: Result[]) => (
  <ShownSearchResultsTrackEvent
    key="ShownPostQueryDrawerScreenEvent"
    action="viewed"
    actionSubject="postQuerySearchResults"
    resultsShown={results}
  />
);

export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
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
    isLoading,
    retrySearch,
    recentlyViewedPages,
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

  // pre query screen
  if (query.length === 0) {
    const recentSpacesToShow = take(recentlyViewedSpaces, 5);
    const recentPagesToShow = take(recentlyViewedPages, 5);

    return [
      renderObjectsGroup('Recent pages and blogs', recentPagesToShow, query),
      renderSpacesGroup('Recent spaces', recentSpacesToShow, query),
      ShownPreQueryResultsEvent([...recentPagesToShow, ...recentSpacesToShow]),
    ];
  }

  // no results screen
  if ([objectResults, spaceResults, peopleResults].every(isEmpty)) {
    return renderNoResults(query);
  }

  // post query screen
  const objectsToShow = take(objectResults, 5);
  const spacesToShow = take(spaceResults, 5);
  const peopleToShow = take(peopleResults, 5);

  return [
    renderObjectsGroup('Pages, blogs and attachments', objectsToShow, query),
    renderSpacesGroup('Spaces', spacesToShow, query),
    renderPeopleGroup('People', peopleToShow, query),
    ShownPostQueryResultsEvent([
      ...objectResults,
      ...spacesToShow,
      ...peopleToShow,
    ]),
  ];
}
