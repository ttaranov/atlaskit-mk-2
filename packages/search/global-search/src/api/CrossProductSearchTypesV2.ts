import { GenericResultMap } from '../model/Result';

export interface SearchQuery {
  scopes?: string[];
  cloudId?: string;
  searchSession?: SearchQuerySession;
  query?: SearchQueryQuery;
}
export interface SearchQuerySession {
  referrerId?: string;
  sessionId?: string;
}
export interface SearchQueryQuery {
  string?: string;
  limit?: number;
}

export type CrossProductSearchResults = {
  results: GenericResultMap;
  experimentId?: string;
  abTest?: ABTest;
};

export interface ABTest {
  abTestId: string;
  controlId: string;
  experimentId: string;
}

export type Avatar = {
  url?: string;
  css?: string;
  urls?: object;
};

export interface SearchResponse {
  scopes: ScopeResult[];
}

export interface ScopeResult {
  id: string;
  experimentId?: string;
  results?: Entry[];
  error?: Error;
  abTest?: ABTest;
}

export interface Entry {
  id: string;
  name: string;
  url: string;
  attributes: Attributes;
}

export interface Attributes {
  '@type': 'issue' | 'board' | 'project' | 'filter';
  containerId?: string;
  containerName?: string;
  ownerId?: string;
  ownerName?: string;
  key?: string;
  issueTypeId?: string;
  issueTypeName?: string;
  projectType?: string;
  avatar?: Avatar;
}

export interface Error {
  message: string;
}
