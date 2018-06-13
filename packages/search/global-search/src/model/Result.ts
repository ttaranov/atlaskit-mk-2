export enum GlobalSearchResultTypes {
  JiraObjectResult,
  GenericContainerResult,
  PersonResult,
  ConfluenceObjectResult,
}

export interface GlobalSearchResult {
  resultId: string;
  // main text to show
  name: string;
  // url to link the result to
  href: string;
  // url to display the avatar from
  avatarUrl?: string;
  // the analytics type to send in the analytics attributes
  analyticsType: AnalyticsType;
  // field to disambiguate between result types
  globalSearchResultType: GlobalSearchResultTypes;
}

export interface GlobalSearchConfluenceObjectResult extends GlobalSearchResult {
  containerName: string;
  contentType: ContentType;
  globalSearchResultType: GlobalSearchResultTypes.ConfluenceObjectResult;
}

export interface GlobalSearchJiraObjectResult extends GlobalSearchResult {
  objectKey: string;
  containerName: string;
  globalSearchResultType: GlobalSearchResultTypes.JiraObjectResult;
}

export interface GlobalSearchContainerResult extends GlobalSearchResult {
  globalSearchResultType: GlobalSearchResultTypes.GenericContainerResult;
}

export interface GlobalSearchPersonResult extends GlobalSearchResult {
  mentionName: string;
  // the message to display underneath the name, unfortuntately named this way ATM.
  presenceMessage: string;
  globalSearchResultType: GlobalSearchResultTypes.PersonResult;
}

/**
 * An enum to identify the specific type of content each search result is displaying.
 * It is used to select the appropriate icon to display.
 */
export enum ContentType {
  ConfluencePage = 'confluence-page',
  ConfluenceBlogpost = 'confluence-blogpost',
  ConfluenceAttachment = 'confluence-attachment',

  // if unspecified, such as when retrieving results from the recent api, 'ambiguous' is used
  ConfluenceAmbiguous = 'confluence-ambiguous',
}

export enum AnalyticsType {
  RecentJira = 'recent-jira',
  RecentConfluence = 'recent-confluence',
  ResultJira = 'result-jira',
  ResultConfluence = 'result-confluence',
  ResultPerson = 'result-person',
  AdvancedSearchJira = 'advanced-search-jira',
  AdvancedSearchConfluence = 'advanced-search-confluence',
  AdvancedSearchPeople = 'advanced-search-people',
}
