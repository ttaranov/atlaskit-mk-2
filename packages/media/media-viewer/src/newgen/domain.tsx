import { MediaItemType, FileItem } from '@atlaskit/media-core';

export type Identifier = {
  type: MediaItemType;
  id: string;
  occurrenceKey: string;
  collectionName?: string;
};

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

export type Model = {
  fileDetails: Outcome<FileItem, Error>;
};

export const initialModel: Model = {
  fileDetails: { status: 'PENDING' },
};
