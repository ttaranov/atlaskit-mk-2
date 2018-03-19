import { MediaType, MediaItemType } from '@atlaskit/media-core';

export type Identifier = {
  type: MediaItemType;
  id: string;
  occurrenceKey: string;
  collectionName?: string;
};

export type FileDetails = {
  mediaType: MediaType;
};

export type Model =
  | {
      type: 'LOADING';
    }
  | {
      type: 'SUCCESS';
      item: FileDetails;
    }
  | {
      type: 'FAILED';
      err: Error;
    };

export const initialModel: Model = {
  type: 'LOADING',
};
