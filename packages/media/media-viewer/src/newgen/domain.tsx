import { MediaItemType } from '@atlaskit/media-core';

export type Identifier = {
  type: MediaItemType;
  id: string;
  occurrenceKey: string;
  collectionName?: string;
};

export type ItemSource =
  | { kind: 'COLLECTION'; collectionName: string }
  | { kind: 'ARRAY'; items: Identifier[] };

export type Outcome<Data, Err> =
  | {
      status: 'PENDING';
    }
  | {
      status: 'SUCCESSFUL';
      data: Data;
    }
  | {
      status: 'FAILED';
      err: Err;
    };
