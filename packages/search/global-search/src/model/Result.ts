export interface Result {
  resultId: string;
  name: string;
  href: string;
  avatarUrl: string;
  containerName?: string;
  objectKey?: string;
  componentType: ComponentType;
  contentType?: ResultContentType;
  analyticsType?: AnalyticsType;
}

// Use string enum here because the type prop in quick-search Result is actually a string
export enum ComponentType {
  Person = 'person',
  Object = 'object',
  Container = 'container',
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
