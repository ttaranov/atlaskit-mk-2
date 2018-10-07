import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
  AuthProvider,
  MediaItem,
  MediaItemProvider,
  UploadableFile,
  UploadController,
  UploadingFileState,
} from '../../../src';
import { ContextFactory } from '../../../src/context/context';
import { fileStreamsCache } from '../../../src/context/fileStreamCache';

import { uploadFile } from '@atlaskit/media-store';

const getOrInsertSpy = jest.spyOn(fileStreamsCache, 'getOrInsert');
const authProvider: AuthProvider = () =>
  Promise.resolve({
    token: 'some-token-that-does-not-really-matter-in-this-tests',
    clientId: 'some-clientId',
    baseUrl: 'some-base-url',
  });

const createContext = () => {
  return ContextFactory.create({
    authProvider,
  });
};

(uploadFile as any) = jest.fn();
const uploadFileMock: jest.Mock<any> = uploadFile as any;

describe('Context', () => {
  const deferredFileId = Promise.resolve('file-id-1');

  beforeEach(() => {
    uploadFileMock.mockReset();
  });

  describe('.getMediaItemProvider()', () => {
    it('should return different mediaItemProviders for different fileIds', () => {
      const fileId = 'some-id';
      const fileId2 = 'some-other-id';
      const context = createContext();
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

      const context = createContext();
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

      const context = createContext();
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
            return of(secondExpectedMediaItem);
          },
        }));

      const context = createContext();
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
            return of(firstExpectedMediaItem);
          },
        }));

      fromPool.mockClear();

      const context = createContext();
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

  describe('local preview', () => {
    it('should get the local preview after being asigned', () => {
      const context = createContext();

      expect(context.getLocalPreview('123')).toBeUndefined();
      context.setLocalPreview('123', 'some-preview');
      expect(context.getLocalPreview('123')).toEqual('some-preview');
      context.removeLocalPreview('123');
      expect(context.getLocalPreview('123')).toBeUndefined();
    });
  });

  describe('.file.getFile()', () => {
    it('should fetch the file if it doesnt exist locally', done => {
      const context = createContext();
      const getFile = jest.fn().mockReturnValue({
        data: {
          processingStatus: 'succeeded',
          id: '1',
          name: 'file-one',
          size: 1,
          fooo: 'bar',
        },
      });
      const fakeStore = {
        getFile,
      };
      (context as any).mediaStore = fakeStore;
      (context.file as any).mediaStore = fakeStore;
      const observer = context.file.getFileState('1');

      observer.subscribe({
        next(state) {
          expect(state).toEqual({
            id: '1',
            status: 'processed',
            name: 'file-one',
            size: 1,
            artifacts: undefined,
          });
          done();
        },
      });

      expect(getFile).toHaveBeenCalledTimes(1);
      expect(getFile).lastCalledWith('1', { collection: undefined });
    });

    it('should poll for changes and return the latest file state', done => {
      jest.useFakeTimers();

      const context = createContext();
      let getFileCalledTimes = 0;
      const getFile = jest.fn().mockImplementation(() => {
        getFileCalledTimes++;
        const processingStatus =
          getFileCalledTimes === 2 ? 'succeeded' : 'pending';

        return {
          data: {
            processingStatus,
            id: '1',
            name: 'file-one',
            size: 1,
          },
        };
      });
      const fakeStore = { getFile };
      (context as any).mediaStore = fakeStore;
      (context.file as any).mediaStore = fakeStore;

      const observer = context.file.getFileState('123');
      const next = jest.fn();

      observer.subscribe({
        next,
        complete() {
          expect(getFile).toHaveBeenCalledTimes(2);
          expect(next).toHaveBeenCalledTimes(2);
          expect(next.mock.calls[0][0].status).toEqual('processing');
          expect(next.mock.calls[1][0].status).toEqual('processed');
          done();
        },
      });

      setImmediate(jest.runAllTimers);
    });

    it('should pass options down', () => {
      const context = createContext();

      context.file.getFileState('1', {
        collectionName: 'my-collection',
        occurrenceKey: 'some-occurrenceKey',
      });

      expect(getOrInsertSpy).toHaveBeenLastCalledWith(
        '1-my-collection-some-occurrenceKey',
        expect.anything(),
      );
    });

    it('should return local file state while file is still uploading', () => {
      const context = createContext();
      const deferredFileId = new Promise(_ => {
        // we don't want to resolve this to simulate the file is uploading
      });
      const getFile = jest.fn();
      const content = new Blob();
      const file = {
        content,
      };
      (context as any).mediaStore = { getFile };
      uploadFileMock.mockImplementation((_, __, callbacks) => {
        callbacks.onId('1');
        return { deferredFileId };
      });

      return new Promise(resolve => {
        context.file.upload(file).subscribe({
          next(state) {
            const fileId = state.id;
            context.file.getFileState(fileId).subscribe({
              next(state) {
                expect(state).toEqual({
                  id: fileId,
                  status: 'uploading',
                  progress: 0,
                  name: '',
                  mediaType: 'unknown',
                  mimeType: '',
                  size: 0,
                  preview: {
                    blob: content,
                  },
                });
                expect(getFile).not.toBeCalled();
                resolve();
              },
            });
          },
        });
      });
    });

    it('should return file state regardless of the state', () => {
      const context = createContext();
      const getFile = jest.fn().mockReturnValue({
        data: {
          processingStatus: 'succeeded',
          id: 'file-id-1',
          name: 'file-one',
          size: 1,
          mediaType: 'image',
          mimeType: 'image/png',
        },
      });
      const next = jest.fn();
      const file = {
        content: 'some-base-64',
      };
      (context as any).mediaStore = { getFile };
      uploadFileMock.mockImplementation((_, __, callbacks) => {
        callbacks.onProgress(0.1);
        callbacks.onId('file-id');
        return { deferredFileId };
      });

      return new Promise(resolve => {
        context.file.upload(file).subscribe({
          next,
          complete() {
            expect(next).toHaveBeenCalledTimes(1);
            expect(next.mock.calls[0][0]).toEqual({
              id: 'file-id',
              status: 'processing',
              mediaType: 'unknown',
              mimeType: '',
              name: '',
              size: 0,
            });
            resolve();
          },
        });
      });
    });
  });

  describe('.file.upload()', () => {
    it('should call media-store uploadFile with given arguments', done => {
      const context = createContext();
      const file: UploadableFile = {} as any;
      uploadFileMock.mockImplementation((_, __, callbacks) => {
        callbacks.onProgress(0.1);
        return { deferredFileId };
      });
      const fakeStore = {};
      (context as any).mediaStore = fakeStore;
      (context.file as any).mediaStore = fakeStore;

      context.file.upload(file).subscribe({
        next() {
          expect(uploadFile).toHaveBeenCalled();
          expect(uploadFileMock.mock.calls[0][0]).toBe(file);
          expect(uploadFileMock.mock.calls[0][1]).toEqual(fakeStore);
          done();
        },
      });
    });

    it('should call subscription error when upload is cancelled', () => {
      const context = createContext();
      const getFile = jest.fn().mockReturnValue({
        data: {
          processingStatus: 'succeeded',
          id: 'file-id-1',
          name: 'file-one',
          size: 1,
        },
      });
      const createDownloadFileStream = jest.fn().mockReturnValue(
        new Observable(observer => {
          observer.complete();
        }),
      );
      const file = {
        content: new Blob(),
        collection: 'some-collection',
      };
      const cancelMock = jest.fn();
      (context as any).mediaStore = { getFile };
      (context as any).createDownloadFileStream = createDownloadFileStream;
      uploadFileMock.mockImplementation((_, __, callbacks) => {
        callbacks.onProgress(0.1);
        let uploadFileReject: any;
        const deferredFileId = new Promise((_, reject) => {
          uploadFileReject = reject;
        });
        return {
          deferredFileId,
          cancel() {
            cancelMock();
            uploadFileReject();
          },
        };
      });
      const controller = new UploadController();

      return new Promise(resolve => {
        context.file.upload(file, controller).subscribe({
          error() {
            expect(cancelMock).toHaveBeenCalledTimes(1);
            resolve();
          },
        });
        controller.abort();
      });
    });

    it('should emit file preview when file is a Blob', () => {
      const context = createContext();
      const getFile = jest.fn().mockReturnValue({
        data: {
          processingStatus: 'succeeded',
          id: 'file-id-1',
          name: 'file-one',
          size: 1,
        },
      });
      const file = {
        content: new File([], '', { type: 'image/png' }),
        name: 'file-name.png',
      };

      uploadFileMock.mockImplementation((_, __, callbacks) => {
        callbacks.onId('1');
        return { deferredFileId };
      });

      (context as any).mediaStore = { getFile };

      return new Promise(resolve => {
        context.file.upload(file).subscribe({
          next(state) {
            expect(state as UploadingFileState).toEqual(
              expect.objectContaining({
                name: 'file-name.png',
                mediaType: 'image',
              }),
            );
            expect((state as any).preview.blob).toBeInstanceOf(Blob);
            resolve();
          },
        });
      });
    });
    it('should pass right mimeType when file is a Blob', () => {
      const context = createContext();
      const getFile = jest.fn().mockReturnValue({
        data: {
          processingStatus: 'succeeded',
        },
      });
      const file = {
        content: new File([], '', { type: 'image/png' }),
      };
      uploadFileMock.mockImplementation((_, __, callbacks) => {
        callbacks.onId('1');
        return { deferredFileId };
      });

      (context as any).mediaStore = { getFile };

      return new Promise(resolve => {
        context.file.upload(file).subscribe({
          next(state) {
            expect((state as UploadingFileState).mimeType).toEqual('image/png');
            resolve();
          },
        });
      });
    });
  });
});
