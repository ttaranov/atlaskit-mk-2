import * as events from 'events';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs';
import {
  Context,
  ContextConfig,
  MediaCollection,
  MediaCollectionProvider,
  MediaItemProvider,
  MediaItem,
  BlobService,
  Auth,
  FileState,
} from '@atlaskit/media-core';

export class Stubs {
  static mediaViewer(overrides: any) {
    const noop = () => {};
    const emitter = new events.EventEmitter();
    const mediaViewer = {
      on: noop,
      off: noop,
      trigger: (event: string) => emitter.emit(event),
      isOpen: jest.fn(),
      open: overrides.open || jest.fn(),
      setFiles: overrides.setFiles || jest.fn(),
      getCurrent: jest.fn(),
      isShowingLastFile: jest.fn(),
    };

    jest
      .spyOn(mediaViewer, 'on')
      .mockImplementation((event, callback) => emitter.on(event, callback));
    jest
      .spyOn(mediaViewer, 'off')
      .mockImplementation((event, callback) =>
        emitter.removeListener(event, callback),
      );

    return mediaViewer;
  }

  static mediaViewerConstructor(overrides?: any) {
    return jest.fn(() => Stubs.mediaViewer(overrides || {}));
  }

  static mediaCollectionProvider(subject?: Subject<MediaCollection>) {
    return {
      observable: jest.fn(() => subject || new Subject<MediaCollection>()),
      refresh: jest.fn(),
      loadNextPage: jest.fn(),
    };
  }

  static mediaItemProvider(subject?: Subject<MediaItem>) {
    return {
      observable: jest.fn(() => subject || new Subject<MediaItem>()),
    };
  }

  static blobService() {
    return {
      fetchImageBlob: jest.fn(() => Promise.resolve(new Blob())),
      fetchOriginalBlob: jest.fn(() => Promise.resolve(new Blob())),
      fetchImageBlobCancelable: jest.fn(() => ({
        response: Promise.resolve(new Blob()),
        cancel: jest.fn(),
      })),
      fetchOriginalBlobCancelable: jest.fn(() => ({
        response: Promise.resolve(new Blob()),
        cancel: jest.fn(),
      })),
    };
  }

  static context(
    config: ContextConfig,
    collectionProvider?: MediaCollectionProvider,
    mediaItemProvider?: MediaItemProvider,
    blobService?: BlobService,
    getFileState?: () => Observable<FileState>,
  ): Partial<Context> {
    return {
      config,
      getMediaCollectionProvider: jest.fn(
        () => collectionProvider || Stubs.mediaCollectionProvider(),
      ),
      getMediaItemProvider: jest.fn(
        () => mediaItemProvider || Stubs.mediaItemProvider(),
      ),
      getBlobService: jest.fn(() => blobService || Stubs.blobService()),
      file: {
        downloadBinary: jest.fn(),
        getFileState: jest.fn(getFileState || (() => Observable.empty())),
        upload: jest.fn(),
      } as any,
    };
  }
}

export interface CreateContextOptions {
  subject?: Subject<any>;
  provider?: MediaCollectionProvider;
  authPromise?: Promise<Auth>;
  blobService?: BlobService;
  getFileState?: () => Observable<FileState>;
  config?: ContextConfig;
}

export const createContext = (options?: CreateContextOptions) => {
  const defaultOptions: CreateContextOptions = {
    subject: undefined,
    provider: undefined,
    authPromise: Promise.resolve<Auth>({
      token: 'some-token',
      clientId: 'some-client-id',
      baseUrl: 'some-service-host',
    }),
    blobService: undefined,
    getFileState: undefined,
    config: undefined,
  };
  const { subject, provider, authPromise, blobService, getFileState, config } =
    options || defaultOptions;
  const authProvider = jest.fn(() => authPromise);
  const contextConfig: ContextConfig = {
    authProvider,
  };
  return Stubs.context(
    config || contextConfig,
    provider || Stubs.mediaCollectionProvider(subject),
    Stubs.mediaItemProvider(subject),
    blobService,
    getFileState,
  ) as any;
};
