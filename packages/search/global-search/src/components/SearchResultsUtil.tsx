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

export function renderResults(results: GlobalSearchResult[]) {
  return results.map(result => {
    const resultType: GlobalSearchResultTypes = result.globalSearchResultType;

    const additionalProps = {
      key: result.resultId,
    };

    switch (resultType) {
      case GlobalSearchResultTypes.ConfluenceObjectResult: {
        return (
          <ObjectResult
            {...additionalProps}
            {...result as GlobalSearchConfluenceObjectResult}
          />
        );
      }
      case GlobalSearchResultTypes.JiraObjectResult: {
        return (
          <ObjectResult
            {...additionalProps}
            {...result as GlobalSearchJiraObjectResult}
          />
        );
      }
      case GlobalSearchResultTypes.GenericContainerResult: {
        return (
          <ContainerResult
            {...additionalProps}
            {...result as GlobalSearchContainerResult}
          />
        );
      }
      case GlobalSearchResultTypes.PersonResult: {
        return (
          <PersonResult
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
