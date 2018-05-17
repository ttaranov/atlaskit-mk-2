import * as React from 'react';
import { ComponentClass } from 'react';
import {
  PersonResult,
  ContainerResult,
  ResultBase,
} from '@atlaskit/quick-search';
import JiraIcon from '@atlaskit/icon/glyph/jira';
import {
  Result,
  ComponentType,
  ResultContentType,
  AnalyticsType,
} from '../model/Result';
import ObjectResult from './ObjectResult';

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

function getResultComponent(componentType: ComponentType): ComponentClass {
  switch (componentType) {
    case ComponentType.Object: {
      return ObjectResult;
    }
    case ComponentType.Person: {
      return PersonResult;
    }
    case ComponentType.Container: {
      return ContainerResult;
    }
    default: {
      // Make the TS compiler verify that all enums have been matched
      const _nonExhaustiveMatch: never = componentType;
      throw new Error(
        `Non-exhaustive match for result type: ${_nonExhaustiveMatch}`,
      );
    }
  }
}

export function renderResults(results: Result[]) {
  return results.map(result => {
    const type = result.analyticsType || result.componentType;
    const Result = getResultComponent(result.componentType) as ComponentClass<
      QuickSearchResult
    >;

    return (
      <Result
        key={result.resultId}
        resultId={result.resultId}
        type={type}
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
    icon={<JiraIcon size="large" label="Search Jira" />}
    key="search_jira"
    resultId="search_jira"
    text="Search for more Jira issues"
    type={AnalyticsType.AdvancedSearchJira}
  />
);

export const searchPeopleItem = (props: AdvancedSearchItemProps) => (
  <ResultBase
    href={`/home/people?q=${encodeURIComponent(props.query)}`}
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
