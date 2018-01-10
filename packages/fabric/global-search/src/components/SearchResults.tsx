import * as React from 'react';
import {
  AkNavigationItemGroup,
  quickSearchResultTypes,
} from '@atlaskit/navigation';
import ConfluenceIcon from '@atlaskit/icon/glyph/confluence';
import JiraIcon from '@atlaskit/icon/glyph/jira';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import { Result, ResultType } from '../model/Result';
import { ComponentClass } from 'react';

const {
  PersonResult,
  ContainerResult,
  ObjectResult,
  ResultBase,
} = quickSearchResultTypes;

function getResultComponent(resultType: ResultType): ComponentClass {
  switch (resultType) {
    case ResultType.Container: {
      return ContainerResult;
    }
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

function resultsToComponents(results: Result[]) {
  return results.map(result => {
    const Result = getResultComponent(result.type);
    return <Result key={result.resultId} {...result} />;
  });
}

const searchConfluenceItem = (query: string) => (
  <ResultBase
    href={`/wiki/dosearchsite.action?queryString=${encodeURIComponent(query)}`}
    icon={<ConfluenceIcon size="large" label="Search Confluence" />}
    key="search_confluence"
    resultId="search_confluence"
    text="Search for more Confluence pages and blogs"
  />
);

const searchJiraItem = (query: string) => (
  <ResultBase
    href={`/issues/?jql=${encodeURIComponent(`text ~ "${query}"`)}`}
    icon={<JiraIcon size="large" label="Search Jira" />}
    key="search_jira"
    resultId="search_jira"
    text="Search for more Jira issues"
  />
);

const searchPeopleItem = () => (
  <ResultBase
    href="/home/people"
    icon={<PeopleIcon size="large" label="Search Peopls" />}
    key="search_people"
    resultId="search_people"
    text="Search for more people"
  />
);

const renderRecent = (results: Result[]) => {
  if (results.length === 0) {
    return null;
  }

  return (
    <AkNavigationItemGroup
      title="Recently viewed"
      key="recent"
      test-selector="recent"
    >
      {resultsToComponents(results)}
    </AkNavigationItemGroup>
  );
};

const renderJira = (results: Result[], query: string) => (
  <AkNavigationItemGroup title="Jira issues" key="jira" test-selector="jira">
    {resultsToComponents(results)}
    {searchJiraItem(query)}
  </AkNavigationItemGroup>
);

const renderConfluence = (results: Result[], query: string) => (
  <AkNavigationItemGroup
    title="Confluence pages and blogs"
    key="confluence"
    test-selector="confluence"
  >
    {resultsToComponents(results)}
    {searchConfluenceItem(query)}
  </AkNavigationItemGroup>
);

const renderPeople = (results: Result[], query: string) => (
  <AkNavigationItemGroup title="People" key="people" test-selector="people">
    {resultsToComponents(results)}
    {searchPeopleItem()}
  </AkNavigationItemGroup>
);

function take(array: Array<any>, n: number) {
  return array.slice(0, n);
}

export interface Props {
  query: string;
  recentlyViewedItems: Result[];
  recentResults: Result[];
  jiraResults: Result[];
  confluenceResults: Result[];
  peopleResults: Result[];
}

// TODO: We can only make this a react component once quick-search is fixed. Currently, AkNavigationItemGroup must be a direct child of
// QuickSearch. This is required for QuickSearch's keyboard controls to work
export default function searchResults(props: Props) {
  const {
    query,
    recentlyViewedItems,
    recentResults,
    jiraResults,
    confluenceResults,
    peopleResults,
  } = props;

  if (query.length < 2) {
    return renderRecent(take(recentlyViewedItems, 10));
  }

  return [
    renderRecent(take(recentResults, 5)),
    renderJira(take(jiraResults, 5), query),
    renderConfluence(take(confluenceResults, 5), query),
    renderPeople(take(peopleResults, 3), query),
  ];
}
