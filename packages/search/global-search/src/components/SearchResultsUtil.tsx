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
  ResultType,
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

function getResultComponent(resultType: ResultType): ComponentClass {
  switch (resultType) {
    case ResultType.Object: {
      return ObjectResult;
    }
    case ResultType.Person: {
      return PersonResult;
    }
    case ResultType.Container: {
      return ContainerResult;
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
