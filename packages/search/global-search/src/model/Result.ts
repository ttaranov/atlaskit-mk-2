export interface Result {
  resultId: string;
  name: string;
  href: string;
  avatarUrl: string;
  containerName?: string;
  objectKey?: string;
  resultType: ResultType;
  analyticsType: AnalyticsType;
  contentType?: ResultContentType;
}

export enum ResultType {
  Person,
  Object,
  Container,
}

export enum ResultContentType {
  Page = 'page',
  Blogpost = 'blogpost',
  Attachment = 'attachment',
  Space = 'space',
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
