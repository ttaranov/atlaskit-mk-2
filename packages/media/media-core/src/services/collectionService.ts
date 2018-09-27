import { MediaApiConfig } from '@atlaskit/media-store';
import {
  MediaCollectionItem,
  MediaCollectionFileItem,
} from '../providers/types';
import { Resources } from '../item';
import createRequest from './util/createRequest';

export const DEFAULT_COLLECTION_PAGE_SIZE: number = 10;

export type SortDirection = 'desc' | 'asc';

export type RemoteCollectionItem =
  | RemoteCollectionFileItem
  | RemoteCollectionLinkItem;

export interface RemoteCollectionFileItem {
  readonly id: string;
  readonly occurrenceKey: string;
  readonly type: 'file';
  readonly details: RemoteCollectionFileItemDetails;
}

export interface RemoteCollectionFileItemDetails {
  readonly name: string;
  readonly size: number;
  readonly mimeType?: string;
}

export interface RemoteCollectionLinkItem {
  readonly id: string;
  readonly occurrenceKey: string;
  readonly type: 'link';
  readonly details: RemoteCollectionLinkItemDetails;
}

export interface RemoteCollectionLinkItemDetails {
  readonly url: string;
  readonly title?: string;
  readonly resources?: Resources;
}

export interface RemoteCollectionItemsResponse {
  items: Array<MediaCollectionItem>;
  nextInclusiveStartKey?: string;
}

export interface CollectionService {
  getCollectionItems(
    collectionName: string,
    limit: number,
    inclusiveStartKey?: string,
    sortDirection?: SortDirection,
    details?: DetailsType,
  ): Promise<RemoteCollectionItemsResponse>;
}

export type DetailsType = 'minimal' | 'full';

export class MediaCollectionService implements CollectionService {
  constructor(private config: MediaApiConfig) {}

  private mapToMediaCollectionItem(
    item: RemoteCollectionItem,
  ): MediaCollectionItem {
    const { id, type, occurrenceKey, details } = item;
    if (type === 'file') {
      const fileDetails = details as RemoteCollectionFileItemDetails;
      return {
        type: 'file',
        details: {
          id,
          occurrenceKey,
          ...fileDetails,
        },
      };
    } else {
      const linkDetails = details as RemoteCollectionLinkItemDetails;
      return {
        type: 'link',
        details: {
          id,
          type: 'link',
          occurrenceKey,
          title: linkDetails.title || '',
          ...linkDetails,
        },
      };
    }
  }

  getCollectionItems(
    collectionName: string,
    limit: number = DEFAULT_COLLECTION_PAGE_SIZE,
    inclusiveStartKey?: string,
    sortDirection?: SortDirection,
    details?: DetailsType,
  ): Promise<RemoteCollectionItemsResponse> {
    const request = createRequest({
      config: this.config,
      preventPreflight: true,
      collectionName,
    });

    return request({
      url: `/collection/${collectionName}/items`,
      params: {
        limit,
        inclusiveStartKey,
        sortDirection,
        details,
      },
    }).response.then(response => {
      // This prevents showing "ghost" files
      const contents = response.data.contents.filter(
        (item: MediaCollectionFileItem) =>
          item.details && item.details.size && item.details.size > 0,
      );

      return {
        items: contents.map(this.mapToMediaCollectionItem),
        nextInclusiveStartKey: response.data.nextInclusiveStartKey,
      };
    });
  }
}
