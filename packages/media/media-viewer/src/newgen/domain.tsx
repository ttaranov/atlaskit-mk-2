import { MediaType, MediaItemType, FileItem } from '@atlaskit/media-core';

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

export type FileDetails = {
  mediaType: MediaType;
  name?: string;
  item?: FileItem;
};

export type Model = {
  fileDetails: Outcome<FileDetails, Error>;
};

export const initialModel: Model = {
  fileDetails: { status: 'PENDING' },
};
