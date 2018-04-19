import * as React from 'react';
import {
  PersonResult,
  ContainerResult,
  ResultBase,
} from '@atlaskit/quick-search';
import ConfluenceIcon from '@atlaskit/icon/glyph/confluence';
import JiraIcon from '@atlaskit/icon/glyph/jira';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import {
  ClientResult,
  ClientResultType,
  ClientResultContentType,
} from '../model/ClientResult';
import ObjectResult from './ObjectResult';

function getResultRenderer(resultType: ClientResultType): Function {
  switch (resultType) {
    case ClientResultType.Object: {
      return renderObjectResult;
    }
    case ClientResultType.Person: {
      return renderPersonResult;
    }
    case ClientResultType.Container: {
      return renderContainerResult;
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

export function renderResults(results: ClientResult[]) {
  return results.map(result => {
    const renderer = getResultRenderer(result.type);
    return renderer(result);
  });
}

export function renderObjectResult(result: ClientResult) {
  // TODO insert the confluence Avatar logic here.
  if (result.contentType == ClientResultContentType.Page) {
  }

  return (
    <ObjectResult
      {...result}
      avatar={
        result.contentType == ClientResultContentType.Page
          ? undefined
          : undefined
      }
    />
  );
}

export function renderPersonResult(result: ClientResult) {
  return <PersonResult {...result} />;
}

export function renderContainerResult(result: ClientResult) {
  return <ContainerResult {...result} />;
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

export const searchPeopleItem = () => (
  <ResultBase
    href="/home/people"
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
