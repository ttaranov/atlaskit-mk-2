// Common properties that the quick-search Result component supports
export interface ClientResult {
  resultId: string;
  type: ClientResultType;
  name: string;
  href: string;
  avatarUrl?: string;
  containerName?: string;
  objectKey?: string;
  contentType?: string;
}

// Use string enum here because the type prop in quick-search Result is actually a string
export enum ClientResultType {
  Person = 'person',
  Object = 'object',
  Container = 'container',
}

export enum ClientResultContentType {
  Page = 'page',
  Blogpost = 'blogpost',
  Space = 'space',
}
