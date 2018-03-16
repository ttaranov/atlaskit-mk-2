import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import {
  Context,
  FileItem,
  MediaType,
} from '@atlaskit/media-core';

import { Identifier } from './media-viewer';

export type FileDetails = {
  mediaType: MediaType;
};

export type RendererModel =
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

export const initialModel: RendererModel = {
  type: 'LOADING',
};

export type DataSource = Observable<FileDetails>;

export interface Subscription {
  unsubscribe(): void;
}

export interface Store {
  subscribe(cb: ((model: RendererModel) => void)): Subscription;
}

export class StoreImpl implements Store {
  private _subject: Subject<RendererModel>;
  constructor(context: Context, data: Identifier) {
    const { id, type, collectionName } = data;
    const provider = context.getMediaItemProvider(id, type, collectionName);

    this._subject = new Subject<RendererModel>();

    provider
      .observable()
      .filter(
        item =>
          item.type === 'file' && item.details.processingStatus === 'succeeded',
      )
      .map(item => ({
        mediaType: (item as FileItem).details.mediaType as MediaType,
      }))
      .subscribe({
        next: item => {
          const model: RendererModel = {
            type: 'SUCCESS',
            item,
          };

          this._subject.next(model);
        },
        error: err => {
          const model: RendererModel = {
            type: 'FAILED',
            err,
          };
          this._subject.next(model);
        },
      });
  }

  subscribe(cb: (model: RendererModel) => void): Subscription {
    return this._subject.subscribe({
      next: cb,
      error: err => {},
      complete: () => {}, // handle error, complete here
    });
  }
}
