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
import {
  PreQueryScreenEvent,
  PostQueryScreenEvent,
} from '../analytics/SceenEvents';

export const MAX_PAGES_BLOGS_ATTACHMENTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

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

const renderPeopleGroup = (title: string, results: Result[], query: string) =>
  results.length > 0 ? (
    <ResultItemGroup title={title} key="people">
      {renderResults(results)}
    </ResultItemGroup>
  ) : null;

export const renderSearchConfluenceItem = (query: string, text: string) =>
  searchConfluenceItem({
    query: query,
    icon: <SearchIcon size="medium" label="Advanced search" />,
    text: text,
    showKeyboardLozenge: true,
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
    {renderSearchConfluenceItem(query, 'Advanced search with filters')}
    {renderSearchPeopleItem(query)}
  </ResultItemGroup>,
];

const renderAdvancedSearchGroup = (query: string) => {
  const text =
    query.length === 0 ? 'Advanced search' : `Advanced search for "${query}"`;

  return (
    <ResultItemGroup key="advanced-search">
      {renderSearchPeopleItem(query)}
      {renderSearchConfluenceItem(query, text)}
    </ResultItemGroup>
  );
};

const preQueryScreenEvent = <PreQueryScreenEvent key="preQueryScreenEvent" />;

const postQueryScreenEvent = (
  <PostQueryScreenEvent key="postQueryScreenEvent" />
);

export interface Props {
  query: string;
  isError: boolean;
  isLoading: boolean;
  retrySearch();
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
  recentlyInteractedPeople: Result[];
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
    // TODO: insert error state here if the recent results are empty.
    if (
      [
        recentlyInteractedPeople,
        recentlyViewedPages,
        recentlyViewedSpaces,
      ].every(isEmpty)
    ) {
      return null;
    }

    return [
      renderObjectsGroup(
        'Recent pages and blogs',
        take(recentlyViewedPages, MAX_PAGES_BLOGS_ATTACHMENTS),
        query,
      ),
      renderSpacesGroup(
        'Recent spaces',
        take(recentlyViewedSpaces, MAX_SPACES),
        query,
      ),
      renderPeopleGroup(
        'Recently worked with',
        take(recentlyInteractedPeople, MAX_PEOPLE),
        query,
      ),
      renderAdvancedSearchGroup(query),
      preQueryScreenEvent,
    ];
  }

  if ([objectResults, spaceResults, peopleResults].every(isEmpty)) {
    return renderNoResults(query);
  }

  return [
    renderObjectsGroup(
      'Pages, blogs and attachments',
      take(objectResults, MAX_PAGES_BLOGS_ATTACHMENTS),
      query,
    ),
    renderSpacesGroup('Spaces', take(spaceResults, MAX_SPACES), query),
    renderPeopleGroup('People', take(peopleResults, MAX_PEOPLE), query),
    renderAdvancedSearchGroup(query),
    postQueryScreenEvent,
  ];
}
