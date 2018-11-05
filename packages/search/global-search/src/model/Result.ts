import { ABTest } from '../api/CrossProductSearchClient';
import { FormattedMessage } from 'react-intl';

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
  contentType: ContentType;
}
/**
 * Map of String keys and Array of results value, but can be empty as well
 */
export interface GenericResultMap {
  [key: string]: Result[];
}

export type ResultsWithTiming = {
  results: GenericResultMap;
  timings?: {
    [key: string]: number | string;
  };
  abTest?: ABTest;
};

export interface ConfluenceResultsMap extends GenericResultMap {
  people: Result[];
  objects: Result[];
  spaces: Result[];
}

export interface JiraResultsMap extends GenericResultMap {
  issues: Result[];
  boards: Result[];
  projects: Result[];
  filters: Result[];
}

export interface ConfluenceObjectResult extends Result {
  containerName: string;
  containerId: string;
  contentType: ContentType;
  resultType: ResultType.ConfluenceObjectResult;
  iconClass?: string;
}

export type ResultsGroup = {
  items: Result[];
  key: string;
  title: FormattedMessage.MessageDescriptor;
};

export interface JiraResult extends Result {
  objectKey?: string;
  containerName?: string;
  resultType: ResultType.JiraObjectResult;
  contentType: ContentType;
}

export interface ContainerResult extends Result {
  resultType: ResultType.GenericContainerResult;
  contentType: ContentType.ConfluenceSpace;
}

export interface PersonResult extends Result {
  mentionName: string;
  // the message to display underneath the name, unfortuntately named this way ATM.
  presenceMessage: string;
  resultType: ResultType.PersonResult;
}

export enum ContentType {
  ConfluencePage = 'confluence-page',
  ConfluenceBlogpost = 'confluence-blogpost',
  ConfluenceAttachment = 'confluence-attachment',
  ConfluenceSpace = 'confluence-space',
  JiraIssue = 'jira-issue',
  JiraBoard = 'jira-board',
  JiraFilter = 'jira-filter',
  JiraProject = 'jira-project',
  Person = 'person',
}

export enum AnalyticsType {
  RecentJira = 'recent-jira',
  ResultJira = 'result-jira',
  RecentConfluence = 'recent-confluence',
  ResultConfluence = 'result-confluence',
  RecentPerson = 'recent-person',
  ResultPerson = 'result-person',
  AdvancedSearchConfluence = 'advanced-search-confluence',
  AdvancedSearchJira = 'advanced-search-jira',
  TopLinkPreQueryAdvancedSearchJira = 'top-link-prequery-advanced-search-jira',
  AdvancedSearchPeople = 'advanced-search-people',
}
