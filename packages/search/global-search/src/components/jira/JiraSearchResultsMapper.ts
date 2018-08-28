import { ResultsGroup, JiraResultsMap, Result } from '../../model/Result';
import { take } from '../SearchResultsUtil';

const MAX_ISSUES = 8;
const MAX_PROJECTS = 2;
const MAX_BOARDS = 2;
const MAX_FILTERS = 2;
const MAX_PEOPLE = 3;

const DEFAULT_JIRA_RESULTS_MAP = {
  issues: [] as Result[],
  boards: [] as Result[],
  filters: [] as Result[],
  projects: [] as Result[],
  people: [] as Result[],
};

export const sliceResults = (resultsMap: JiraResultsMap) => {
  const { issues, boards, filters, projects, people } = resultsMap
    ? resultsMap
    : DEFAULT_JIRA_RESULTS_MAP;

  const [issuesToDisplay, peopleToDisplay, ...others] = [
    { items: issues, count: MAX_ISSUES },
    { items: people, count: MAX_PEOPLE },
    { items: boards, count: MAX_BOARDS },
    { items: filters, count: MAX_FILTERS },
    { items: projects, count: MAX_PROJECTS },
  ].map(({ items, count }) => take(items, count));

  return {
    issuesToDisplay,
    others,
    peopleToDisplay,
  };
};

export const mapRecentResultsToUIGroups = (
  recentlyViewedObjects: JiraResultsMap,
): ResultsGroup[] => {
  const { issuesToDisplay, peopleToDisplay, others } = sliceResults(
    recentlyViewedObjects,
  );

  return [
    {
      items: issuesToDisplay,
      key: 'issues',
      titleI18nId: 'global-search.jira.recent-issues-heading',
    },
    {
      items: others.reduce((acc, arr) => [...acc, ...arr]),
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
  searchResultsObjects: JiraResultsMap,
): ResultsGroup[] => {
  const { issuesToDisplay, peopleToDisplay, others } = sliceResults(
    searchResultsObjects,
  );
  return [
    {
      items: issuesToDisplay,
      key: 'issues',
      titleI18nId: 'global-search.jira.seach-result-issues-heading',
    },
    {
      items: others.reduce((acc, arr) => [...acc, ...arr]),
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
