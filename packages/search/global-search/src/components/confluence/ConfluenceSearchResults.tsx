import * as React from 'react';
import styled from 'styled-components';
import { colors, gridSize, math } from '@atlaskit/theme';
import { ResultItemGroup } from '@atlaskit/quick-search';
import SearchIcon from '@atlaskit/icon/glyph/search';
import { FormattedMessage } from 'react-intl';
import { Result } from '../../model/Result';
import SearchError from '../SearchError';
import NoRecentActivity from '../NoRecentActivity';
import NoResults from '../NoResults';
import {
  renderResults,
  searchConfluenceItem,
  searchPeopleItem,
  take,
  isEmpty,
  getConfluenceAdvancedSearchLink,
} from '../SearchResultsUtil';
import AnalyticsEventFiredOnMount from '../analytics/AnalyticsEventFiredOnMount';
import { buildScreenEvent, Screen } from '../../util/analytics-util';

export const MAX_PAGES_BLOGS_ATTACHMENTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

let preQueryScreenCounter = 0;
let postQueryScreenCounter = 0;

const renderObjectsGroup = (
  title: JSX.Element,
  results: Result[],
  query: string,
) =>
  results.length > 0 ? (
    <ResultItemGroup title={title} key="objects">
      {renderResults(results)}
    </ResultItemGroup>
  ) : null;

const renderSpacesGroup = (
  title: JSX.Element,
  results: Result[],
  query: string,
) =>
  results.length > 0 ? (
    <ResultItemGroup title={title} key="spaces">
      {renderResults(results)}
    </ResultItemGroup>
  ) : null;

const renderPeopleGroup = (
  title: JSX.Element,
  results: Result[],
  query: string,
) =>
  results.length > 0 ? (
    <ResultItemGroup title={title} key="people">
      {renderResults(results)}
    </ResultItemGroup>
  ) : null;

const renderSearchConfluenceItem = (query: string, text: JSX.Element) =>
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
    text: <FormattedMessage id="global-search.people.advanced-search" />,
  });

const renderNoResults = (query: string) => [
  <NoResults key="no-results" />,
  <ResultItemGroup title="" key="advanced-search">
    {renderSearchConfluenceItem(
      query,
      <FormattedMessage id="global-search.confluence.advanced-search-filters" />,
    )}
    {renderSearchPeopleItem(query)}
  </ResultItemGroup>,
];

const PeopleSearchWrapper = styled.div`
  margin-top: ${math.multiply(gridSize, 3)}px;
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
    query.length === 0 ? (
      <FormattedMessage id="global-search.confluence.advanced-search" />
    ) : (
      <FormattedMessage
        id="global-search.confluence.advanced-search-for"
        values={{ query }}
      />
    );

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
  keepRecentActivityResults: boolean;
  searchSessionId: string;
}

const renderRecentActivities = (
  query: string,
  recentlyViewedPages: Result[],
  recentlyViewedSpaces: Result[],
  recentlyInteractedPeople: Result[],
  searchSessionId: string,
) => [
  renderObjectsGroup(
    <FormattedMessage id="global-search.confluence.recent-pages-heading" />,
    take(recentlyViewedPages, 8),
    query,
  ),
  renderSpacesGroup(
    <FormattedMessage id="global-search.confluence.recent-spaces-heading" />,
    take(recentlyViewedSpaces, MAX_SPACES),
    query,
  ),
  renderPeopleGroup(
    <FormattedMessage id="global-search.people.recent-people-heading" />,
    take(recentlyInteractedPeople, MAX_PEOPLE),
    query,
  ),
  renderAdvancedSearchGroup(query),
  <AnalyticsEventFiredOnMount
    key="preQueryScreenEvent"
    onEventFired={() => preQueryScreenCounter++}
    payloadProvider={() =>
      buildScreenEvent(Screen.PRE_QUERY, preQueryScreenCounter, searchSessionId)
    }
  />,
];

const renderSearchResults = (
  query: string,
  objectResults: Result[],
  spaceResults: Result[],
  peopleResults: Result[],
  searchSessionId: string,
) => {
  return [
    renderObjectsGroup(
      <FormattedMessage id="global-search.confluence.confluence-objects-heading" />,
      take(objectResults, MAX_PAGES_BLOGS_ATTACHMENTS),
      query,
    ),
    renderSpacesGroup(
      <FormattedMessage id="global-search.confluence.spaces-heading" />,
      take(spaceResults, MAX_SPACES),
      query,
    ),
    renderPeopleGroup(
      <FormattedMessage id="global-search.people.people-heading" />,
      take(peopleResults, MAX_PEOPLE),
      query,
    ),
    renderAdvancedSearchGroup(query),

    <AnalyticsEventFiredOnMount
      key="postQueryScreenEvent"
      onEventFired={() => postQueryScreenCounter++}
      payloadProvider={() =>
        buildScreenEvent(
          Screen.POST_QUERY,
          postQueryScreenCounter,
          searchSessionId,
        )
      }
    />,
  ];
};

const renderNoQuery = (
  query: string,
  recentlyViewedPages: Result[],
  recentlyViewedSpaces: Result[],
  recentlyInteractedPeople: Result[],
  searchSessionId,
) => {
  if (
    [recentlyInteractedPeople, recentlyViewedPages, recentlyViewedSpaces].every(
      isEmpty,
    )
  ) {
    return (
      <NoRecentActivity advancedSearchUrl={getConfluenceAdvancedSearchLink()} />
    );
  }
  return renderRecentActivities(
    query,
    recentlyViewedPages,
    recentlyViewedSpaces,
    recentlyInteractedPeople,
    searchSessionId,
  );
};

const render = (props: Props) => {
  const {
    query,
    isError,
    objectResults,
    spaceResults,
    peopleResults,
    isLoading,
    recentlyViewedPages,
    recentlyViewedSpaces,
    recentlyInteractedPeople,
    retrySearch,
    keepRecentActivityResults,
    searchSessionId,
  } = props;

  if (isError) {
    return <SearchError onRetryClick={retrySearch} />;
  }

  if (query.length === 0) {
    return isLoading
      ? null
      : renderNoQuery(
          query,
          recentlyViewedPages,
          recentlyViewedSpaces,
          recentlyInteractedPeople,
          searchSessionId,
        );
  }

  if ([objectResults, spaceResults, peopleResults].every(isEmpty)) {
    return isLoading && keepRecentActivityResults
      ? renderRecentActivities(
          query,
          recentlyViewedPages,
          recentlyViewedSpaces,
          recentlyInteractedPeople,
          searchSessionId,
        )
      : renderNoResults(query);
  }

  return renderSearchResults(
    query,
    objectResults,
    spaceResults,
    peopleResults,
    searchSessionId,
  );
};

export default render;
