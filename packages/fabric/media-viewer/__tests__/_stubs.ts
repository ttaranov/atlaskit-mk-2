import * as events from 'events';
import { Subject } from 'rxjs/Subject';
import {
  ContextConfig,
  MediaCollection,
  MediaCollectionProvider,
  MediaItemProvider,
  MediaItem,
} from '@atlaskit/media-core';

export class Stubs {
  static mediaViewer(overrides) {
    const noop = () => {};
    const emitter = new events.EventEmitter();
    const mediaViewer = {
      on: noop,
      off: noop,
      trigger: event => emitter.emit(event),
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
      loadNextPageUntil: jest.fn(),
    };
  }

  static mediaItemProvider(subject?: Subject<MediaItem>) {
    return {
      observable: jest.fn(() => subject || new Subject<MediaItem>()),
    };
  }

  static context(
    config: ContextConfig,
    collectionProvider?: MediaCollectionProvider,
    mediaItemProvider?: MediaItemProvider,
  ) {
    return {
      config,
      getMediaCollectionProvider: jest.fn(
        () => collectionProvider || Stubs.mediaCollectionProvider(),
      ),
      getMediaItemProvider: jest.fn(
        () => mediaItemProvider || Stubs.mediaItemProvider(),
      ),
    };
  }
}
