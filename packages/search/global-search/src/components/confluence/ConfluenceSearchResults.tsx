import * as React from 'react';
import styled from 'styled-components';
import { colors, gridSize, math } from '@atlaskit/theme';
import { ResultItemGroup } from '@atlaskit/quick-search';
import SearchIcon from '@atlaskit/icon/glyph/search';
import PeopleIconGlyph from '../../assets/PeopleIconGlyph';
import Icon from '@atlaskit/icon';
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

const MAX_RECENT_PAGES = 8;
export const MAX_PAGES_BLOGS_ATTACHMENTS = 8;
export const MAX_SPACES = 3;
export const MAX_PEOPLE = 3;

const getAnalyticsComponent = (screenCounter, searchSessionId, analyticsKey) =>
  screenCounter ? (
    <AnalyticsEventFiredOnMount
      key={analyticsKey}
      onEventFired={() => screenCounter.increment()}
      payloadProvider={() =>
        buildScreenEvent(
          Screen.POST_QUERY,
          screenCounter.getCount(),
          searchSessionId,
        )
      }
    />
  ) : null;

const renderObjectsGroup = (
  title: JSX.Element,
  results: Result[],
  sectionIndex: number,
) =>
  results.length > 0 ? (
    <ResultItemGroup title={title} key="objects">
      {renderResults(results, sectionIndex)}
    </ResultItemGroup>
  ) : null;

const renderSpacesGroup = (
  title: JSX.Element,
  results: Result[],
  sectionIndex: number,
) =>
  results.length > 0 ? (
    <ResultItemGroup title={title} key="spaces">
      {renderResults(results, sectionIndex)}
    </ResultItemGroup>
  ) : null;

const renderPeopleGroup = (
  title: JSX.Element,
  results: Result[],
  sectionIndex: number,
) =>
  results.length > 0 ? (
    <ResultItemGroup title={title} key="people">
      {renderResults(results, sectionIndex)}
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
    icon: <Icon glyph={PeopleIconGlyph} size="medium" label="Search people" />,
    text: <FormattedMessage id="global-search.people.advanced-search" />,
  });

const renderNoResults = (query: string, screenCounter, searchSessionId) => [
  <NoResults key="no-results" />,
  <ResultItemGroup title="" key="advanced-search">
    {renderSearchConfluenceItem(
      query,
      <FormattedMessage id="global-search.confluence.advanced-search-filters" />,
    )}
    {renderSearchPeopleItem(query)}
  </ResultItemGroup>,
  getAnalyticsComponent(screenCounter, searchSessionId, 'postQueryScreenEvent'),
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

export interface ScreenCounter {
  getCount(): number;
  increment();
}

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
  screenCounters?: {
    preQueryScreenCounter: ScreenCounter;
    postQueryScreenCounter: ScreenCounter;
  };
}

const renderRecentActivities = (
  query: string,
  recentlyViewedPages: Result[],
  recentlyViewedSpaces: Result[],
  recentlyInteractedPeople: Result[],
  searchSessionId: string,
  screenCounter?: ScreenCounter,
) => {
  let sectionIndex = 0;
  const renderedObjectsGroup = renderObjectsGroup(
    <FormattedMessage id="global-search.confluence.recent-pages-heading" />,
    take(recentlyViewedPages, MAX_RECENT_PAGES),
    sectionIndex,
  );

  if (renderedObjectsGroup !== null) {
    sectionIndex++;
  }

  const renderedSpacesGroup = renderSpacesGroup(
    <FormattedMessage id="global-search.confluence.recent-spaces-heading" />,
    take(recentlyViewedSpaces, MAX_SPACES),
    sectionIndex,
  );

  if (renderedSpacesGroup !== null) {
    sectionIndex++;
  }

  const renderedPeopleGroup = renderPeopleGroup(
    <FormattedMessage id="global-search.people.recent-people-heading" />,
    take(recentlyInteractedPeople, MAX_PEOPLE),
    sectionIndex,
  );

  return [
    renderedObjectsGroup,
    renderedSpacesGroup,
    renderedPeopleGroup,
    renderAdvancedSearchGroup(query),
    getAnalyticsComponent(
      screenCounter,
      searchSessionId,
      'preQueryScreenEvent',
    ),
  ];
};

const renderSearchResults = (
  query: string,
  objectResults: Result[],
  spaceResults: Result[],
  peopleResults: Result[],
  searchSessionId: string,
  screenCounter?: ScreenCounter,
) => {
  let sectionIndex = 0;
  const renderedObjectsGroup = renderObjectsGroup(
    <FormattedMessage id="global-search.confluence.confluence-objects-heading" />,
    take(objectResults, MAX_PAGES_BLOGS_ATTACHMENTS),
    sectionIndex,
  );

  if (renderedObjectsGroup !== null) {
    sectionIndex++;
  }

  const renderedSpacesGroup = renderSpacesGroup(
    <FormattedMessage id="global-search.confluence.spaces-heading" />,
    take(spaceResults, MAX_SPACES),
    sectionIndex,
  );

  if (renderedSpacesGroup !== null) {
    sectionIndex++;
  }

  const renderedPeopleGroup = renderPeopleGroup(
    <FormattedMessage id="global-search.people.people-heading" />,
    take(peopleResults, MAX_PEOPLE),
    sectionIndex,
  );
  return [
    renderedObjectsGroup,
    renderedSpacesGroup,
    renderedPeopleGroup,
    renderAdvancedSearchGroup(query),
    getAnalyticsComponent(
      screenCounter,
      searchSessionId,
      'postQueryScreenEvent',
    ),
  ];
};

const renderNoQuery = (
  query: string,
  recentlyViewedPages: Result[],
  recentlyViewedSpaces: Result[],
  recentlyInteractedPeople: Result[],
  searchSessionId,
  screenCounter?: ScreenCounter,
) => {
  if (
    [recentlyInteractedPeople, recentlyViewedPages, recentlyViewedSpaces].every(
      isEmpty,
    )
  ) {
    return [
      <NoRecentActivity
        key="no-recent-activity"
        advancedSearchUrl={getConfluenceAdvancedSearchLink()}
      />,
      getAnalyticsComponent(
        screenCounter,
        searchSessionId,
        'preQueryScreenEvent',
      ),
    ];
  }

  return renderRecentActivities(
    query,
    recentlyViewedPages,
    recentlyViewedSpaces,
    recentlyInteractedPeople,
    searchSessionId,
    screenCounter,
  );
};

export default class ConfluenceSearchResults extends React.Component<Props> {
  render() {
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
      screenCounters,
    } = this.props;

    const { preQueryScreenCounter, postQueryScreenCounter } = screenCounters
      ? screenCounters
      : {
          preQueryScreenCounter: undefined,
          postQueryScreenCounter: undefined,
        };

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
            preQueryScreenCounter,
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
            preQueryScreenCounter,
          )
        : renderNoResults(query, screenCounters, searchSessionId);
    }

    return renderSearchResults(
      query,
      objectResults,
      spaceResults,
      peopleResults,
      searchSessionId,
      postQueryScreenCounter,
    );
  }
}
