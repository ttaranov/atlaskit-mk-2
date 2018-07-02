import * as React from 'react';
import styled from 'styled-components';
import { colors, gridSize } from '@atlaskit/theme';
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
    text: 'Search in People',
  });

const renderNoResults = (query: string) => [
  <NoResults key="no-results" />,
  <ResultItemGroup title="" key="advanced-search">
    {renderSearchConfluenceItem(query, 'Advanced search with filters')}
    {renderSearchPeopleItem(query)}
  </ResultItemGroup>,
];

const PeopleSearchWrapper = styled.div`
  margin-top: ${gridSize * 3}px;
`;

const StickyFooter = styled.div`
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid ${colors.N40};
  padding: ${gridSize}px 0;
`;

const renderAdvancedSearchGroup = (query: string) => {
  const text =
    query.length === 0 ? 'Advanced search' : `Advanced search for "${query}"`;

  return [
    <PeopleSearchWrapper key="people-search">
      {renderSearchPeopleItem(query)}
    </PeopleSearchWrapper>,
    <StickyFooter key="advanced-search">
      {renderSearchConfluenceItem(query, text)}
    </StickyFooter>,
  ];
};

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
    return [
      renderObjectsGroup(
        'Recent pages and blogs',
        take(recentlyViewedPages, 8),
        query,
      ),
      renderSpacesGroup('Recent spaces', take(recentlyViewedSpaces, 3), query),
      renderPeopleGroup(
        'Recently worked with',
        take(recentlyInteractedPeople, 3),
        query,
      ),
      renderAdvancedSearchGroup(query),
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
    renderAdvancedSearchGroup(query),
  ];
}
