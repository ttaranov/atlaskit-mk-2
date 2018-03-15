/* tslint:disable:variable-name */
import { AxiosError } from 'axios';
import { MediaCollection } from './collection';

export interface FetchingCollectionSucceeded {
  type: 'FETCHING_COLLECTION_SUCCEEDED';
  collection: MediaCollection;
  hasNextPage: boolean;
}

export interface FetchingCollectionFailed {
  type: 'FETCHING_COLLECTION_FAILED';
  error: AxiosError;
}

export function fetchingCollectionSucceeded(
  collection: MediaCollection,
  hasNextPage: boolean,
): FetchingCollectionSucceeded {
  return {
    type: 'FETCHING_COLLECTION_SUCCEEDED',
    collection: collection,
    hasNextPage: hasNextPage,
  };
}

export function fetchingCollectionFailed(
  error: AxiosError,
): FetchingCollectionFailed {
  return {
    type: 'FETCHING_COLLECTION_FAILED',
    error,
  };
}

export type Action = FetchingCollectionSucceeded | FetchingCollectionFailed;
