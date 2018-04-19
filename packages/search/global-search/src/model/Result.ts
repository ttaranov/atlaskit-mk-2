// Common properties that the quick-search Result component supports
export interface Result {
  resultId: string;
  type: ResultType;
  name: string;
  href: string;
  avatarUrl: string;
  containerName?: string;
  objectKey?: string;
  contentType?: ResultContentType;
}

// Use string enum here because the type prop in quick-search Result is actually a string
export enum ResultType {
  Person = 'person',
  Object = 'object',
  Space = 'space',
}

export enum ResultContentType {
  Page = 'page',
  Blogpost = 'blogpost',
  Space = 'space',
}
