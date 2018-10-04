import {
  ResultsGroup,
  JiraResultsMap,
  GenericResultMap,
  Result,
} from '../../model/Result';
import { take } from '../SearchResultsUtil';

const MAX_OBJECTS = 8;
const MAX_CONTAINERS = 6;
const MAX_PEOPLE = 3;

const DEFAULT_JIRA_RESULTS_MAP: GenericResultMap = {
  objects: [] as Result[],
  containers: [],
};

export const sliceResults = (resultsMap: GenericResultMap | null) => {
  const { objects, containers, people } = resultsMap
    ? resultsMap
    : DEFAULT_JIRA_RESULTS_MAP;

  const [objectsToDisplay, peopleToDisplay, containersToDisplay] = [
    { items: objects, count: MAX_OBJECTS },
    { items: people, count: MAX_PEOPLE },
    { items: containers, count: MAX_CONTAINERS },
  ].map(({ items, count }) => take(items, count));

  return {
    objectsToDisplay,
    containersToDisplay,
    peopleToDisplay,
  };
};

export const mapRecentResultsToUIGroups = (
  recentlyViewedObjects: JiraResultsMap | null,
): ResultsGroup[] => {
  const {
    objectsToDisplay,
    peopleToDisplay,
    containersToDisplay,
  } = sliceResults(recentlyViewedObjects);

  return [
    {
      items: objectsToDisplay,
      key: 'issues',
      titleI18nId: 'global-search.jira.recent-issues-heading',
    },
    {
      items: containersToDisplay,
      key: 'containers',
      titleI18nId: 'global-search.jira.recent-containers',
    },
    {
      items: peopleToDisplay,
      key: 'people',
      titleI18nId: 'global-search.jira.recent-people-heading',
    },
  ];
};

export const mapSearchResultsToUIGroups = (
  searchResultsObjects: JiraResultsMap | null,
): ResultsGroup[] => {
  const {
    objectsToDisplay,
    peopleToDisplay,
    containersToDisplay,
  } = sliceResults(searchResultsObjects);
  return [
    {
      items: objectsToDisplay,
      key: 'issues',
      titleI18nId: 'global-search.jira.seach-result-issues-heading',
    },
    {
      items: containersToDisplay,
      key: 'containers',
      titleI18nId: 'global-search.jira.seach-result-containers-heading',
    },
    {
      items: peopleToDisplay,
      key: 'people',
      titleI18nId: 'global-search.jira.seach-result-people-heading',
    },
  ];
};
