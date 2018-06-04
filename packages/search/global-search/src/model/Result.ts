export interface Result {
  resultId: string;
  name: string;
  href: string;
  // Either avatarUrl or contentType should be defined
  avatarUrl?: string;
  contentType?: ResultContentType;
  containerName?: string;
  objectKey?: string;
  resultType: ResultType;
  analyticsType: AnalyticsType;
  //
  subText?: string;
  caption?: string;
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
