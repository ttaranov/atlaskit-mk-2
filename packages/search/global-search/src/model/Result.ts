export enum ResultType {
  JiraObjectResult = 'jira-object-result',
  GenericContainerResult = 'generic-container-result',
  PersonResult = 'person-result',
  ConfluenceObjectResult = 'confluence-object-result',
}

export interface Result {
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
  resultType: ResultType;
  // optional container id
  containerId?: string;
  // optional id for the experiment that generated this result
  experimentId?: string;
}
/**
 * Map of String keys and Array of results value, but can be empty as well
 */
export interface GenericResultObject {
  [key: string]: Result[];
}

export interface ConfluenceRecentlyViewedItemsMap extends GenericResultObject {
  recentlyInteractedPeople: Result[];
  recentlyViewedPages: Result[];
  recentlyViewedSpaces: Result[];
}

export interface JiraRecentlyViewedItemsMap extends GenericResultObject {
  recentlyViewedIssues: Result[];
  recentlyViewdBoards: Result[];
  recentlyViewedProjects: Result[];
}

export interface ConfluenceObjectResult extends Result {
  containerName: string;
  containerId: string;
  contentType?: ContentType;
  resultType: ResultType.ConfluenceObjectResult;
  iconClass?: string;
}

export type ResultsGroup = {
  items: Result[];
  key: string;
  titleI18nId: string;
};

export interface JiraObjectResult extends Result {
  objectKey?: string;
  containerName?: string;
  resultType: ResultType.JiraObjectResult;
  contentType?: ContentType;
}

export interface ContainerResult extends Result {
  resultType: ResultType.GenericContainerResult;
}

export interface PersonResult extends Result {
  mentionName: string;
  // the message to display underneath the name, unfortuntately named this way ATM.
  presenceMessage: string;
  resultType: ResultType.PersonResult;
}

/**
 * An enum to identify the specific type of content each search result is displaying.
 * It is used to select the appropriate icon to display.
 */
export enum ContentType {
  ConfluencePage = 'confluence-page',
  ConfluenceBlogpost = 'confluence-blogpost',
  ConfluenceAttachment = 'confluence-attachment',
  JiraIssue = 'jira-issue',
  JiraBoard = 'jira-board',
  JiraFilter = 'jira-filter',
  JiraProject = 'jira-project',
  Person = 'person',
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
