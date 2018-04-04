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
export type FilePreview = ImagePreview | VideoPreview;

export interface Navigation {
  left: File[],
  selected: File,
  right: File[]
}

export type File = {
  identifier: Identifier;
  fileDetails: Outcome<FileDetails, Error>;
  filePreview: Outcome<FilePreview, Error>;
}

export type Model = Outcome<Navigation, Error>;

export const initialModel: Model = {
  status: 'PENDING'
}

export type NavigationEvent = 'next' | 'prev';

export type Action = {
  type: 'CLOSE'
} | {
  type: 'LIST_UPDATE',
  data: Navigation;
} | {
  type: 'ITEM_DETAILS_UPDATE',
  data: {
    identifier: Identifier,
    details: Outcome<FileDetails, Error>
  };
} | {
  type: 'ITEM_PREVIEW_UPDATE',
  data: {
    identifier: Identifier,
    preview: Outcome<FilePreview, Error>
  };
}| {
  type: 'NAVIGATION_EVENT',
  data: NavigationEvent
}

export type DataSource = {
  type: 'COLLECTION',
  collectionName: string,
  selected: Identifier
} | {
  type: 'LIST',
  items: Identifier[]
  selected: Identifier
}
