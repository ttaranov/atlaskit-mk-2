import * as React from 'react';
import { ComponentClass } from 'react';
import { PersonResult, ContainerResult } from '@atlaskit/quick-search';
import JiraIcon from '@atlaskit/icon/glyph/jira';
import {
  Result,
  ResultType,
  ResultContentType,
  AnalyticsType,
} from '../model/Result';
import ObjectResult from './ObjectResult';
import AdvancedSearchResult from './AdvancedSearchResult';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  DEFUALT_GAS_CHANNEL,
  DEFAULT_GAS_SOURCE,
  DEFAULT_GAS_ATTRIBUTES,
} from '../util/analytics';

// Common properties that the quick-search Result component supports
interface QuickSearchResult extends ComponentClass {
  type: string;
  name: string;
  resultId: string;
  href: string;
  avatarUrl?: string;
  containerName?: string;
  objectKey?: string;
  contentType?: ResultContentType;
}

function createAndFireSearchResultSelectedEvent(createEvent, props): void {
  const event = createEvent(); // created empty to initialise with context
  const searchSessionId = event.context[0]
    ? event.context[0].searchSessionId
    : null;
  event.update({
    action: 'selected',
    actionSubject: 'navigationItem',
    actionSubjectId: 'searchResult',
    eventType: 'track',
    source: DEFAULT_GAS_SOURCE,
    attributes: {
      searchSessionId: searchSessionId,
      resultType: props.type,
      ...DEFAULT_GAS_ATTRIBUTES,
    },
  });
  event.fire(DEFUALT_GAS_CHANNEL);
}

const searchResultsAnalyticsEvents = {
  onClick: createAndFireSearchResultSelectedEvent,
};

export const ObjectResultWithAnalytics = withAnalyticsEvents(
  searchResultsAnalyticsEvents,
)(ObjectResult);
export const PersonResultWithAnalytics = withAnalyticsEvents(
  searchResultsAnalyticsEvents,
)(PersonResult);
export const ContainerResultWithAnalytics = withAnalyticsEvents(
  searchResultsAnalyticsEvents,
)(ContainerResult);

function getResultComponent(resultType: ResultType): ComponentClass {
  switch (resultType) {
    case ResultType.Object: {
      return ObjectResultWithAnalytics;
    }
    case ResultType.Person: {
      return PersonResultWithAnalytics;
    }
    case ResultType.Container: {
      return ContainerResultWithAnalytics;
    }
    default: {
      // Make the TS compiler verify that all enums have been matched
      const _nonExhaustiveMatch: never = resultType;
      throw new Error(
        `Non-exhaustive match for result type: ${_nonExhaustiveMatch}`,
      );
    }
  }
}

export function renderResults(results: Result[]) {
  return results.map(result => {
    const Result = getResultComponent(result.resultType) as ComponentClass<
      QuickSearchResult
    >;

    return (
      <Result
        key={result.resultId}
        resultId={result.resultId}
        type={result.analyticsType}
        name={result.name}
        containerName={result.containerName}
        href={result.href}
        avatarUrl={result.avatarUrl}
        objectKey={result.objectKey}
        contentType={result.contentType}
      />
    );
  });
}

export interface AdvancedSearchItemProps {
  query: string;
  icon: JSX.Element;
  text: string;
  showKeyboardLozenge?: boolean;
}

export const searchConfluenceItem = (props: AdvancedSearchItemProps) => (
  <AdvancedSearchResult
    href={getConfluenceAdvancedSearchLink(props.query)}
    key="search_confluence"
    resultId="search_confluence"
    text={props.text}
    icon={props.icon}
    type={AnalyticsType.AdvancedSearchConfluence}
    showKeyboardLozenge={props.showKeyboardLozenge || false}
  />
);

export const searchJiraItem = (query: string) => (
  <AdvancedSearchResult
    href={`/issues/?jql=${encodeURIComponent(`text ~ "${query}"`)}`}
    icon={<JiraIcon size="medium" label="Search Jira" />}
    key="search_jira"
    resultId="search_jira"
    text="Search for more Jira issues"
    type={AnalyticsType.AdvancedSearchJira}
  />
);

export const searchPeopleItem = (props: AdvancedSearchItemProps) => (
  <AdvancedSearchResult
    href={`/people/search?q=${encodeURIComponent(props.query)}`}
    icon={props.icon}
    key="search_people"
    resultId="search_people"
    text={props.text}
    type={AnalyticsType.AdvancedSearchPeople}
  />
);

function getConfluenceAdvancedSearchLink(query: string) {
  return `/wiki/dosearchsite.action?queryString=${encodeURIComponent(query)}`;
}

export function redirectToConfluenceAdvancedSearch(query = '') {
  // TODO this breaks SPA navigation. Consumer needs to pass in a redirect/navigate function.
  window.location.assign(getConfluenceAdvancedSearchLink(query));
}

export function take<T>(array: Array<T>, n: number) {
  return array.slice(0, n);
}

export function isEmpty<T>(array: Array<T>) {
  return array.length === 0;
}
