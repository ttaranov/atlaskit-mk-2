import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import {
  Context,
  FileItem,
  MediaType,
  MediaItemType
} from '@atlaskit/media-core';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

export type Identifier = {
  type: MediaItemType;
  id: string;
  occurrenceKey: string;
  collectionName?: string;
};

export type Details = {
  mediaType: MediaType;
}

export type ImageDetails = Details & {
  thumbnailUrl: string;
  mediumSizeUrl: string;
}

export type DocumentDetails = Details & {

}

export type FileDetails = ImageDetails | DocumentDetails;

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

export type DataSource = Observable<FileDetails>;

export interface Subscription {
  unsubscribe(): void;
}

export interface Store {
  subscribe(cb: ((model: Model) => void)): Subscription;
}

const processDocEvent = async (file: FileItem, context: Context, subject: Subject<Model>, collection?: string) => {
  subject.next({
    type: 'SUCCESS',
    item: {
      mediaType: 'doc'
    }
  });
};

const processImageEvent = async (file: FileItem, context: Context, subject: Subject<Model>, collection?: string) => {
  const service = context.getDataUriService(collection, true);

  const thumbSizePromise = service.fetchImageDataBlob(file, {
    width: 100,
    height: 75,
    mode: 'fit'
  });

  const mediumSize = service.fetchImageDataBlob(file, {
    width: 800,
    height: 600,
    mode: 'fit'
  });

  const thumbBlob = await thumbSizePromise;
  const thumbObjectUrl = URL.createObjectURL(thumbBlob)

  subject.next({
    type: 'SUCCESS',
    item: {
      mediaType: 'image',
      thumbnailUrl: thumbObjectUrl,
      mediumSizeUrl: thumbObjectUrl,
    },
  });

  const mediumBlob = await mediumSize;
  const mediumObjectUrl = URL.createObjectURL(mediumBlob)

  subject.next({
    type: 'SUCCESS',
    item: {
      mediaType: 'image',
      thumbnailUrl: thumbObjectUrl,
      mediumSizeUrl: mediumObjectUrl,
    },
  });
};

const onItemProviderDataEvent = (file: FileItem, context: Context, subject: Subject<Model>, collection?: string) : void => {
  console.log('onItemProviderDataEvent');

  switch(file.details.mediaType) {
    case 'image':
      processImageEvent(file, context, subject, collection);
      return;
    case 'doc':
      processDocEvent(file, context, subject, collection);
      return;
    default:
      throw new Error('not implemented');
  };
};

const onProviderErrorEvent = (err: Error, subject: Subject<Model>): void => {
  const model: Model = { type: 'FAILED', err };
  subject.next(model);
};

export class StoreImpl implements Store {
  private _subject: Subject<Model>;
  constructor(context: Context, data: Identifier) {
    const { id, type, collectionName } = data;
    const provider = context.getMediaItemProvider(id, type, collectionName);

    this._subject = new Subject<Model>();

    provider
      .observable()
      .filter(item => item.type === 'file')
      .subscribe({
        next: item => onItemProviderDataEvent(item as FileItem, context, this._subject, collectionName),
        error: err => onProviderErrorEvent(err, this._subject)
      });
  }

  subscribe(cb: (model: Model) => void): Subscription {
    return this._subject.subscribe({
      next: cb,
      error: err => {},
      complete: () => {}, // handle error, complete here
    });
  }
}