import { Model, Identifier, File, initialModel, Action, DataSource } from './domain';
import { Subject } from 'rxjs/Subject';
import {
  Context,
  FileItem,
  MediaType
} from '@atlaskit/media-core';
import { constructAuthTokenUrl, rightIdentifiers, leftIdentifiers, toPendingFile } from './util';
import { reduce } from './reducer';

export const REQUEST_CANCELLED = 'request_cancelled';

export interface Subscription {
  unsubscribe(): void;
}

export interface Store {
  subscribe(cb: ((model: Model) => void)): Subscription;
}

export interface StoreOptions {
  preloadNextNumber: number,
  preloadPrevNumber: number
}

export class StoreImpl implements Store {

  private _subject: Subject<Model>;
  private context: Context;
  private model: Model = initialModel;
  private cancelImageFetch?: () => void;
  private options: StoreOptions;

  constructor(context: Context, dataSource: DataSource, options: StoreOptions) { // TODO: shape of data?
    this._subject = new Subject<Model>();
    this.context = context;
    this.options = options;
    switch (dataSource.type) {
      case 'LIST':
        this.initListDataSource(dataSource.items, dataSource.selected);
        return;
      case 'COLLECTION':
        this.initCollectionDataSource(dataSource.collectionName, dataSource.selected);
    }
  }

  subscribe(cb: (model: Model) => void): Subscription {
    return this._subject.subscribe({
      next: cb,
      error: err => {}, // TODO
      complete: () => {},
    });
  }

  dispatch (action: Action): void {
    this.model = reduce(this.model, action);
    if (action.type === 'NAVIGATION_EVENT' || action.type === 'LIST_UPDATE') {
      this.smartLoad(this.model);
    }
    this._subject.next(this.model);
  }

  private smartLoad(model: Model) {
    if (model.status === 'SUCCESSFUL') {
      const items = [
        model.data.selected,
        ...model.data.right.slice(0, this.options.preloadNextNumber),  // preload the next two items
        ...model.data.left.slice(model.data.left.length - this.options.preloadPrevNumber, model.data.left.length) // and the previous one
      ]
        .filter(i => i.fileDetails.status === 'PENDING' || i.filePreview.status === 'PENDING')
        .map(i => i.identifier);
      this.loadItems(items);
    }
  }

  private loadItems(items: Identifier[]) {
    items.forEach(i => {
      const provider = this.context.getMediaItemProvider(i.id, i.type, i.collectionName);
      provider
        .observable()
        .filter(item => item.type === 'file')
        .subscribe({
          next: item => this.updateFileDetails(i, item as FileItem, this.context),
          error: err => {} // TODO
        });
    });
  }

  private initListDataSource(items: Identifier[], selected: Identifier) {
    const right = rightIdentifiers(items, selected);
    const left = leftIdentifiers(items, selected);
    this.dispatch({
      type: 'LIST_UPDATE',
      data: {
        left: left.map(toPendingFile),
        selected: toPendingFile(selected),
        right: right.map(toPendingFile),
      }
    });
  }

  private initCollectionDataSource(collectionName: string, selected: Identifier) {
    // TODO: We need to have https://product-fabric.atlassian.net/browse/MSW-311
    // in order to implement collection support properly.
    const provider = this.context.getMediaCollectionProvider(collectionName, 30);
    provider
    .observable()
    .subscribe({
      next: collection => {
        const items = collection.items.map(i=> ({
          id: i.details.id || '', // TODO: deal with optional id param?
          occurrenceKey: i.details.occurrenceKey,
          type: i.type,
          collectionName
        }));
        this.initListDataSource(items, selected);
      },
      error: err => {} // TODO
    });
  }

  private updateFileDetails(identifier: Identifier, item: FileItem, context: Context, collectionName?: string) {
    this.dispatch({
      type: 'ITEM_DETAILS_UPDATE',
      data: {
        identifier,
        details: {
          status: 'SUCCESSFUL',
          data: {
            mediaType: item.details.mediaType as MediaType
          }
        }
      }
    });
    switch (item.details.mediaType) {
      case 'image':
        this.updateImagePreviewData(identifier, item, context);
        break;
      case 'video':
        this.updateVideoPreviewData(identifier, item, context, collectionName);
        break;
      default:
        this.notSupportedPreview(identifier, item);
        break;
    }
  }

  private notSupportedPreview(identifier: Identifier, details: FileItem) {
    this.dispatch({
      type: 'ITEM_PREVIEW_UPDATE',
      data: {
        identifier,
        preview: {
          status: 'FAILED',
          err: new Error(`${details.details.mediaType} is no supported`)
        }
      }
    });
  }

  private async updateImagePreviewData(
    identifier: Identifier,
    fileItem: FileItem,
    context: Context,
  ) {
    try {
      const service = context.getBlobService();
      const { response, cancel } = service.fetchImageBlobCancelable(fileItem, {
        width: 800,
        height: 600,
        mode: 'fit',
        allowAnimated: true,
      });
      this.cancelImageFetch = () => cancel(REQUEST_CANCELLED);
      const objectUrl = URL.createObjectURL(await response);

      this.dispatch({
        type: 'ITEM_PREVIEW_UPDATE',
        data: {
          identifier,
          preview: {
            status: 'SUCCESSFUL',
            data: {
              viewer: 'IMAGE',
              objectUrl
            }
          }
        }
      });
    } catch (err) {
      if (err.message === REQUEST_CANCELLED) {
        // this.preventRaceCondition(); // TODO
      } else {
        this.dispatch({
          type: 'ITEM_PREVIEW_UPDATE',
          data: {
            identifier,
            preview: {
              status: 'FAILED',
              err: new Error('error fetching image')
            }
          }
        });
      }
    }
  }

  private async updateVideoPreviewData(
    identifier: Identifier,
    fileItem: FileItem,
    context: Context,
    collectionName?: string,
  ) {
    const videoArtifactUrl = getVideoArtifactUrl(fileItem);
    if (videoArtifactUrl) {
      const src = await constructAuthTokenUrl(
        videoArtifactUrl,
        context,
        collectionName,
      );
      this.dispatch({
        type: 'ITEM_PREVIEW_UPDATE',
        data: {
          identifier,
          preview: {
            status: 'SUCCESSFUL',
            data: {
              viewer: 'VIDEO',
              src
            }
          }
        }
      });
    } else {
      this.dispatch({
        type: 'ITEM_PREVIEW_UPDATE',
        data: {
          identifier,
          preview: {
            status: 'FAILED',
            err: new Error('error fetching video')
          }
        }
      });
  }
  }
}

function getVideoArtifactUrl(fileItem: FileItem) {
  const artifact = 'video_640.mp4';
  return (
    fileItem.details &&
    fileItem.details.artifacts &&
    fileItem.details.artifacts[artifact] &&
    fileItem.details.artifacts[artifact].url
  );
}
