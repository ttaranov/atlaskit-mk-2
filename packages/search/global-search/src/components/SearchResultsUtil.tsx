import * as React from 'react';
import { ComponentClass } from 'react';
import { PersonResult, ResultBase } from '@atlaskit/quick-search';
import ConfluenceIcon from '@atlaskit/icon/glyph/confluence';
import JiraIcon from '@atlaskit/icon/glyph/jira';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import { Result, ResultType } from '../model/Result';
import ObjectResult from './ObjectResult';

function getResultComponent(resultType: ResultType): ComponentClass {
  switch (resultType) {
    case ResultType.Object: {
      return ObjectResult;
    }
    case ResultType.Person: {
      return PersonResult;
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
    const Result = getResultComponent(result.type);
    return <Result key={result.resultId} {...result} />;
  });
}

export const searchConfluenceItem = (query: string) => (
  <ResultBase
    href={`/wiki/dosearchsite.action?queryString=${encodeURIComponent(query)}`}
    icon={<ConfluenceIcon size="large" label="Search Confluence" />}
    key="search_confluence"
    resultId="search_confluence"
    text="Search for more Confluence pages and blogs"
  />
);

export const searchJiraItem = (query: string) => (
  <ResultBase
    href={`/issues/?jql=${encodeURIComponent(`text ~ "${query}"`)}`}
    icon={<JiraIcon size="large" label="Search Jira" />}
    key="search_jira"
    resultId="search_jira"
    text="Search for more Jira issues"
  />
);

export const searchPeopleItem = (query: string) => (
  <ResultBase
    href={`/home/people?q=${encodeURIComponent(query)}`}
    icon={<PeopleIcon size="large" label="Search People" />}
    key="search_people"
    resultId="search_people"
    text="Search for more people"
  />
);

export function take<T>(array: Array<T>, n: number) {
  return array.slice(0, n);
}

export function isEmpty<T>(array: Array<T>) {
  return array.length === 0;
}
