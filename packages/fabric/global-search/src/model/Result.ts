export interface Result {
  resultId: string;
  type: ResultType;
  name: string;
  href: string;
  avatarUrl: string;
  containerName?: string;
}

// Use string enum here because the type prop in ResultBase is a string and used in callbacks/analytics
export enum ResultType {
  Person = 'person',
  Container = 'container',
  Object = 'object',
}
