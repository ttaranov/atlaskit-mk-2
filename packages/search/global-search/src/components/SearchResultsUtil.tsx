export const ADVANCED_CONFLUENCE_SEARCH_RESULT_ID = 'search_confluence';
export const ADVANCED_JIRA_SEARCH_RESULT_ID = 'search_jira';
export const ADVANCED_PEOPLE_SEARCH_RESULT_ID = 'search_people';

export enum JiraEntityTypes {
  Projects = 'projects',
  Issues = 'issues',
  Boards = 'boards',
  Filters = 'filters',
  People = 'people',
}

const JIRA_ADVANCED_SEARCH_URLS = {
  [JiraEntityTypes.Issues]: query =>
    `/secure/QuickSearch.jspa?searchString=${query}`,
  [JiraEntityTypes.Boards]: query =>
    `/secure/ManageRapidViews.jspa?contains=${query}`,
  [JiraEntityTypes.Filters]: query =>
    `/secure/ManageFilters.jspa?Search=Search&filterView=search&name=${query}`,
  [JiraEntityTypes.Projects]: query => `/projects?contains=${query}`,
  [JiraEntityTypes.People]: query => `/people/search?q=${query}`,
};

export const isAdvancedSearchResult = (resultId: string) =>
  [
    ADVANCED_CONFLUENCE_SEARCH_RESULT_ID,
    ADVANCED_JIRA_SEARCH_RESULT_ID,
    ADVANCED_PEOPLE_SEARCH_RESULT_ID,
  ].some(advancedResultId => advancedResultId === resultId);

export function getConfluenceAdvancedSearchLink(query?: string) {
  const queryString = query ? `?queryString=${encodeURIComponent(query)}` : '';
  return `/wiki/dosearchsite.action${queryString}`;
}

export function getJiraAdvancedSearchUrl(
  entityType: JiraEntityTypes,
  query?: string,
) {
  const getUrl = JIRA_ADVANCED_SEARCH_URLS[entityType];
  return getUrl(query || '');
}

export function redirectToConfluenceAdvancedSearch(query = '') {
  // XPSRCH-891: this breaks SPA navigation. Consumer needs to pass in a redirect/navigate function.
  window.location.assign(getConfluenceAdvancedSearchLink(query));
}

export function redirectToJiraAdvancedSearch(
  entityType: JiraEntityTypes,
  query = '',
) {
  window.location.assign(getJiraAdvancedSearchUrl(entityType, query));
}

export function take<T>(array: Array<T>, n: number) {
  return (array || []).slice(0, n);
}

export function isEmpty<T>(array: Array<T>) {
  return array.length === 0;
}

export function objectValues(object) {
  return Object.keys(object || {}).map(key => object[key]);
}
/**
 *
 * Gracefully handle promise catch and returning default value
 * @param promise promise to handle its catch block
 * @param defaultValue value returned by the promise in case of error
 * @param errorHandler function to be called in case of promise rejection
 */
export function handlePromiseError<T>(
  promise: Promise<T>,
  defaultValue: T,
  errorHandler?: ((reason: any) => T | void),
): Promise<T> {
  return promise.catch(error => {
    try {
      if (errorHandler) {
        errorHandler(error);
      }
    } catch (e) {}
    return defaultValue;
  });
}
