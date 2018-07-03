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
  getConfluenceAdvancedSearchLink,
} from '../SearchResultsUtil';
import NoRecentActivity from '../NoRecentActivity';

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

export default class extends React.Component<Props> {
  shouldComponentUpdate(nextProps) {
    return !nextProps.isLoading;
  }

  renderNoQuery() {
    const {
      recentlyViewedPages,
      recentlyViewedSpaces,
      recentlyInteractedPeople,
      query,
    } = this.props;
    if (
      [
        recentlyInteractedPeople,
        recentlyViewedPages,
        recentlyViewedSpaces,
      ].every(isEmpty)
    ) {
      return (
        <NoRecentActivity
          advancedSearchUrl={getConfluenceAdvancedSearchLink()}
        />
      );
    }
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

  renderSearchResults() {
    const { query, objectResults, spaceResults, peopleResults } = this.props;
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

  render() {
    const {
      query,
      isError,
      isLoading,
      retrySearch,
      objectResults,
      spaceResults,
      peopleResults,
    } = this.props;

    if (isLoading) {
      return null; // better than showing empty error, but worth some more thought.
    }

    if (isError) {
      return <SearchError onRetryClick={retrySearch} />;
    }

    if (query.length === 0) {
      return this.renderNoQuery();
    }

    if ([objectResults, spaceResults, peopleResults].every(isEmpty)) {
      return renderNoResults(query);
    }

    return this.renderSearchResults();
  }
}
