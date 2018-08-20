import { ResultsGroup, JiraResultsMap } from '../../model/Result';
import { take } from '../SearchResultsUtil';

const MAX_ISSUES = 8;
const MAX_PROJECTS = 2;
const MAX_BOARDS = 2;
const MAX_FILTERS = 2;

export const mapRecentResultsToUIGroups = (
  recentlyViewedObjects: JiraResultsMap,
): ResultsGroup[] => {
  const {
    issues = [],
    boards = [],
    filters = [],
    projects = [],
  } = recentlyViewedObjects;

  const [issuesToDisplay, ...others] = [
    { items: issues, count: MAX_ISSUES },
    { items: boards, count: MAX_BOARDS },
    { items: filters, count: MAX_FILTERS },
    { items: projects, count: MAX_PROJECTS },
  ].map(({ items, count }) => take(items, count));

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
  ];
};

export const mapSearchResultsToUIGroups = (
  searchResultsObjects: JiraResultsMap,
): ResultsGroup[] => {
  return [];
};
