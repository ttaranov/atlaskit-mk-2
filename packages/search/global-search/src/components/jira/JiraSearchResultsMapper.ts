import {
  ResultsGroup,
  JiraResultsMap,
  GenericResultMap,
  Result,
} from '../../model/Result';
import { take } from '../SearchResultsUtil';

const MAX_ISSUES = 8;
const MAX_PROJECTS = 2;
const MAX_BOARDS = 2;
const MAX_FILTERS = 2;
const MAX_PEOPLE = 3;

const scopeLimits = {
  'jira.issue': MAX_ISSUES,
  'jira.board,filter,project': MAX_BOARDS + MAX_FILTERS + MAX_PROJECTS,
  people: MAX_PEOPLE,
};

const scopeI18n = {
  'jira.issue': 'global-search.jira.seach-result-issues-heading',
  'jira.board,filter,project':
    'global-search.jira.seach-result-containers-heading',
  people: 'global-search.jira.seach-result-people-heading',
};

const DEFAULT_JIRA_RESULTS_MAP: GenericResultMap = {
  issues: [] as Result[],
  boards: [],
  filters: [],
  projects: [],
  people: [],
};

export const sliceResults = (resultsMap: JiraResultsMap) => {
  const { issues, boards, filters, projects, people } = resultsMap
    ? resultsMap
    : DEFAULT_JIRA_RESULTS_MAP;

  const [issuesToDisplay, peopleToDisplay, ...pseudoContainers] = [
    { items: issues, count: MAX_ISSUES },
    { items: people, count: MAX_PEOPLE },
    { items: boards, count: MAX_BOARDS },
    { items: filters, count: MAX_FILTERS },
    { items: projects, count: MAX_PROJECTS },
  ].map(({ items, count }) => take(items, count));

  return {
    issuesToDisplay,
    pseudoContainers,
    peopleToDisplay,
  };
};

export const mapRecentResultsToUIGroups = (
  recentlyViewedObjects: JiraResultsMap,
): ResultsGroup[] => {
  const { issuesToDisplay, peopleToDisplay, pseudoContainers } = sliceResults(
    recentlyViewedObjects,
  );

  return [
    {
      items: issuesToDisplay,
      key: 'issues',
      titleI18nId: 'global-search.jira.recent-issues-heading',
    },
    {
      items: pseudoContainers.reduce((acc, arr) => [...acc, ...arr]),
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
  searchResultsObjects: GenericResultMap,
): ResultsGroup[] => {
  return Object.keys(scopeLimits)
    .filter(key => searchResultsObjects[key].length)
    .map(key => ({
      items: searchResultsObjects[key].slice(0, scopeLimits[key]),
      key,
      titleI18nId: scopeI18n[key],
    }));
};
