import {
  ResultsGroup,
  JiraResultsMap,
  GenericResultMap,
  Result,
} from '../../model/Result';
import { take } from '../SearchResultsUtil';
import { messages } from '../../messages';

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
      title: messages.jira_recent_issues_heading,
    },
    {
      items: containersToDisplay,
      key: 'containers',
      title: messages.jira_recent_containers,
    },
    {
      items: peopleToDisplay,
      key: 'people',
      title: messages.jira_recent_people_heading,
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
      title: messages.jira_search_result_issues_heading,
    },
    {
      items: containersToDisplay,
      key: 'containers',
      title: messages.jira_search_result_containers_heading,
    },
    {
      items: peopleToDisplay,
      key: 'people',
      title: messages.jira_search_result_people_heading,
    },
  ];
};
