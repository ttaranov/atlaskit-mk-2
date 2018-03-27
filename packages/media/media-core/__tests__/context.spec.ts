import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MediaItem, MediaItemProvider } from '../src';
import { ContextFactory } from '../src/context/context';

const authProvider = () =>
  Promise.resolve({
    token: 'some-token-that-does-not-really-matter-in-this-tests',
    clientId: 'some-clientId',
  });

const createFakeContext = () => {
  return ContextFactory.create({
    serviceHost: 'service-host',
    authProvider,
  });
};

describe('Context', () => {
  describe('.getMediaItemProvider()', () => {
    it('should return different mediaItemProviders for different fileIds', () => {
      const fileId = 'some-id';
      const fileId2 = 'some-other-id';
      const context = createFakeContext();
      const mediaItemProvider = context.getMediaItemProvider(fileId, 'file');
      expect(mediaItemProvider).not.toBe(
        context.getMediaItemProvider(fileId2, 'file'),
      );
    });

    it('should return media item when a link media item is passed in', done => {
      let actualMediaItem: MediaItem;
      const expectedMediaItem: MediaItem = {
        type: 'link',
        details: {
          id: 'abcd',
          type: 'link',
          url: 'http://google.com.au',
          title: 'Google!!!',
        },
      };

      const context = createFakeContext();
      const provider = context.getMediaItemProvider(
        'some-id',
        'link',
        undefined,
        expectedMediaItem,
      );

      provider.observable().subscribe({
        next(mediaItem) {
          actualMediaItem = mediaItem;
        },
        complete() {
          expect(actualMediaItem).toBe(expectedMediaItem);
          done();
        },
        error(error) {
          done(error || new Error('Uknown error.'));
        },
      });
    });

    it('should return media item when a file media item is passed in and the media item processingStatus is not pending', done => {
      let actualMediaItem: MediaItem;
      const expectedMediaItem: MediaItem = {
        type: 'file',
        details: {
          id: 'abcd',
        },
      };

      const context = createFakeContext();
      const provider = context.getMediaItemProvider(
        'some-id',
        'link',
        undefined,
        expectedMediaItem,
      );

      provider.observable().subscribe({
        next(mediaItem) {
          actualMediaItem = mediaItem;
        },
        complete() {
          expect(actualMediaItem).toBe(expectedMediaItem);
          done();
        },
        error(error) {
          done(error || new Error('Uknown error.'));
        },
      });
    });

    it('should return media item and then fetch media item when a file media item is passed in and the processingStatus is pending', done => {
      let actualMediaItems: Array<MediaItem> = [];
      const firstExpectedMediaItem: MediaItem = {
        type: 'file',
        details: {
          id: 'abcd',
          processingStatus: 'pending',
        },
      };
      const secondExpectedMediaItem: MediaItem = {
        type: 'file',
        details: {
          id: 'abcd',
          processingStatus: 'succeeded',
        },
      };

      const fromPool = jest
        .spyOn(MediaItemProvider, 'fromPool')
        .mockImplementation(() => ({
          observable() {
            return Observable.of(secondExpectedMediaItem);
          },
        }));

      const context = createFakeContext();
      const provider = context.getMediaItemProvider(
        'some-id',
        'link',
        undefined,
        firstExpectedMediaItem,
      );

      provider.observable().subscribe({
        next(mediaItem) {
          actualMediaItems.push(mediaItem);
        },
        complete() {
          expect(fromPool).toHaveBeenCalledTimes(1);
          expect(actualMediaItems).toHaveLength(2);
          expect(actualMediaItems[0]).toBe(firstExpectedMediaItem);
          expect(actualMediaItems[1]).toBe(secondExpectedMediaItem);
          done();
        },
        error(error) {
          done(error || new Error('Uknown error.'));
        },
      });
    });

    it('should fetch media item when no media item is passed in', done => {
      let actualMediaItems: Array<MediaItem> = [];
      const firstExpectedMediaItem: MediaItem = {
        type: 'file',
        details: {
          id: 'abcd',
          processingStatus: 'succeeded',
        },
      };

      const fromPool = jest
        .spyOn(MediaItemProvider, 'fromPool')
        .mockImplementation(() => ({
          observable() {
            return Observable.of(firstExpectedMediaItem);
          },
        }));

      fromPool.mockClear();

      const context = createFakeContext();
      const provider = context.getMediaItemProvider(
        'some-id',
        'link',
        undefined,
      );

      provider.observable().subscribe({
        next(mediaItem) {
          actualMediaItems.push(mediaItem);
        },
        complete() {
          expect(fromPool).toHaveBeenCalledTimes(1);
          expect(actualMediaItems).toHaveLength(1);
          expect(actualMediaItems[0]).toBe(firstExpectedMediaItem);
          done();
        },
        error(error) {
          done(error || new Error('Uknown error.'));
        },
      });
    });
  });
});
