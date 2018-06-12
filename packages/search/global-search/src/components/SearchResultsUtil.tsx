import * as React from 'react';
import {
  PersonResult,
  ContainerResult,
  ResultBase,
} from '@atlaskit/quick-search';
import JiraIcon from '@atlaskit/icon/glyph/jira';
import {
  GlobalSearchResult,
  GlobalSearchContainerResult,
  GlobalSearchJiraObjectResult,
  GlobalSearchPersonResult,
  AnalyticsType,
  GlobalSearchResultTypes,
  GlobalSearchConfluenceObjectResult,
} from '../model/Result';
import ObjectResult from './ObjectResult';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import {
  DEFUALT_GAS_CHANNEL,
  DEFAULT_GAS_SOURCE,
  DEFAULT_GAS_ATTRIBUTES,
} from '../util/analytics';

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

export function renderResults(results: GlobalSearchResult[]) {
  return results.map(result => {
    const resultType: GlobalSearchResultTypes = result.globalSearchResultType;

    const additionalProps = {
      key: result.resultId,
    };

    switch (resultType) {
      case GlobalSearchResultTypes.ConfluenceObjectResult: {
        return (
          <ObjectResultWithAnalytics
            {...additionalProps}
            {...result as GlobalSearchConfluenceObjectResult}
          />
        );
      }
      case GlobalSearchResultTypes.JiraObjectResult: {
        return (
          <ObjectResultWithAnalytics
            {...additionalProps}
            {...result as GlobalSearchJiraObjectResult}
          />
        );
      }
      case GlobalSearchResultTypes.GenericContainerResult: {
        return (
          <ContainerResultWithAnalytics
            {...additionalProps}
            {...result as GlobalSearchContainerResult}
          />
        );
      }
      case GlobalSearchResultTypes.PersonResult: {
        return (
          <PersonResultWithAnalytics
            {...additionalProps}
            {...result as GlobalSearchPersonResult}
          />
        );
      }
      default: {
        // Make the TS compiler verify that all enums have been matched
        const _nonExhaustiveMatch: never = resultType;
        throw new Error(
          `Non-exhaustive match for result type: ${_nonExhaustiveMatch}`,
        );
      }
    }
  });
}

export interface AdvancedSearchItemProps {
  query: string;
  icon: JSX.Element;
  text: string;
}

export const searchConfluenceItem = (props: AdvancedSearchItemProps) => (
  <ResultBase
    href={`/wiki/dosearchsite.action?queryString=${encodeURIComponent(
      props.query,
    )}`}
    icon={props.icon}
    key="search_confluence"
    resultId="search_confluence"
    text={props.text}
    type={AnalyticsType.AdvancedSearchConfluence}
  />
);

export const searchJiraItem = (query: string) => (
  <ResultBase
    href={`/issues/?jql=${encodeURIComponent(`text ~ "${query}"`)}`}
    icon={<JiraIcon size="medium" label="Search Jira" />}
    key="search_jira"
    resultId="search_jira"
    text="Search for more Jira issues"
    type={AnalyticsType.AdvancedSearchJira}
  />
);

export const searchPeopleItem = (props: AdvancedSearchItemProps) => (
  <ResultBase
    href={`/people/search?q=${encodeURIComponent(props.query)}`}
    icon={props.icon}
    key="search_people"
    resultId="search_people"
    text={props.text}
    type={AnalyticsType.AdvancedSearchPeople}
  />
);

export function take<T>(array: Array<T>, n: number) {
  return array.slice(0, n);
}

export function isEmpty<T>(array: Array<T>) {
  return array.length === 0;
}
