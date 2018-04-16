import { MediaType, MediaItemType } from '@atlaskit/media-core';

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
};

export type ObjectUrl = string;

export type ImagePreview = {
  viewer: 'IMAGE';
  objectUrl: ObjectUrl;
};
export type VideoPreview = {
  viewer: 'VIDEO';
  src: string;
};
export type PDFPreview = {
  viewer: 'PDF';
  doc: Blob;
};
export type FilePreview = ImagePreview | VideoPreview | PDFPreview;

export type Model = {
  fileDetails: Outcome<FileDetails, Error>;
  previewData: Outcome<FilePreview, Error>;
};

export const initialModel: Model = {
  fileDetails: { status: 'PENDING' },
  previewData: { status: 'PENDING' },
};
