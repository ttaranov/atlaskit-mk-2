import * as uuid from 'uuid';

import {
  mockStore,
  mockWsConnectionHolder,
  mockPopupUploadEventEmitter,
} from '../../../mocks';

import {
  importFilesMiddleware,
  isRemoteService,
  importFiles,
} from '../../importFiles';
import { LocalUpload, LocalUploads, Tenant } from '../../../domain';
import { RECENTS_COLLECTION } from '../../../config';
import { finalizeUpload } from '../../../actions/finalizeUpload';
import { startImport } from '../../../actions/startImport';
import { resetView } from '../../../actions/resetView';
import {
  UploadEndEvent,
  UploadPreviewUpdateEvent,
  UploadProcessingEvent,
  UploadEventName,
} from '../../../../domain/uploadEvent';
import MockContext = jest.MockContext;
import { Action, Dispatch } from 'redux';
import {
  setEventProxy,
  SetEventProxyAction,
} from '../../../actions/setEventProxy';
import { getPreview } from '../../../actions/getPreview';
import { hidePopup } from '../../../actions/hidePopup';
import { MediaFile } from '../../../../domain/file';
import {
  isSendUploadEventAction,
  SendUploadEventAction,
  SendUploadEventActionPayload,
} from '../../../actions/sendUploadEvent';
import { SCALE_FACTOR_DEFAULT } from '../../../../util/getPreviewFromImage';

describe('importFiles middleware', () => {
  const todayDate = Date.now();
  interface SetupOptions {
    withSelectedItems: boolean;
  }
  const defaultOptions: SetupOptions = {
    withSelectedItems: true,
  };
  const upfrontId = Promise.resolve('1');
  const makeFileData = (index: number) => ({
    id: `some-selected-item-id-${index}`,
    name: `picture${index}.jpg`,
    mimeType: 'image/jpg',
    size: 42 + index,
    upfrontId,
  });

  const getSendUploadEventPayloads = (
    store: { dispatch: jest.Mock<{}> },
    eventName: UploadEventName,
  ): SendUploadEventActionPayload[] => {
    return store.dispatch.mock.calls
      .map(args => args[0] as SendUploadEventAction)
      .filter(isSendUploadEventAction)
      .filter(({ payload: { event } }) => event.name === eventName)
      .map(({ payload }) => payload);
  };

  const getDispatchArgs = (store: any, type: string): Action[] =>
    (store.dispatch.mock as MockContext<Dispatch<any>>).calls
      .filter(args => args[0].type === type)
      .map(args => args[0]);

  const setup = (opts: Partial<SetupOptions> = {}) => {
    const { withSelectedItems } = {
      ...defaultOptions,
      ...opts,
    } as SetupOptions;
    const tenant: Tenant = {} as Tenant;

    const makeLocalUpload = (index: number, total: number): LocalUpload => {
      const files: MediaFile[] = [];

      // Each LocalUpload will have a list of events with one of them being uploads-start,
      // and each of those events will contain all UploadFiles.
      for (let i = 1; i <= total; i++) {
        const { id, name, mimeType: type, size, upfrontId } = makeFileData(i);
        files.push({
          id,
          name,
          type,
          size,
          upfrontId,
          creationDate: todayDate,
        });
      }

      const file = files[index - 1];
      const fileWithPublicId = { ...file, publicId: `publicId-${index}` };
      const uploadProcessingEvent: UploadProcessingEvent = {
        name: 'upload-processing',
        data: {
          file: fileWithPublicId,
        },
      };

      const uploadPreviewUpdateEvent: UploadPreviewUpdateEvent = {
        name: 'upload-preview-update',
        data: {
          file,
          preview: {
            dimensions: {
              width: 10,
              height: 10,
            },
            scaleFactor: SCALE_FACTOR_DEFAULT,
          },
        },
      };

      const uploadEndEvent: UploadEndEvent = {
        name: 'upload-end',
        data: {
          file: {
            ...file,
            publicId: `some-public-id-${index}`,
          },
          public: {
            id: `some-public-id-${index}`,
          },
        },
      };

      return {
        file: {
          metadata: {
            ...makeFileData(index),
          },
        },
        events: [
          // uploads-event won't be part of events list. See fileUploadsAdd.tsx
          uploadPreviewUpdateEvent,
          uploadProcessingEvent,
          uploadEndEvent,
        ],
        tenant,
        index,
        progress: null,
        timeStarted: 0,
      };
    };

    const localUploads: LocalUploads = {
      'some-selected-item-id-1': makeLocalUpload(1, 3),
      'some-selected-item-id-2': makeLocalUpload(2, 3),
      'some-selected-item-id-3': makeLocalUpload(3, 3),
    };

    const store = mockStore(
      withSelectedItems
        ? {
            uploads: localUploads,
            tenant,
            selectedItems: [
              {
                serviceName: 'upload',
                ...makeFileData(1),
                accountId: '',
                date: todayDate,
              },
              // Not all uploaded files are being selected. number 2 was skipped
              {
                serviceName: 'upload',
                ...makeFileData(3),
                accountId: '',
                date: todayDate,
              },
              {
                serviceName: 'recent_files',
                ...makeFileData(4),
                accountId: '',
                date: todayDate,
              },
              {
                serviceName: 'dropbox',
                ...makeFileData(5),
                accountId: 'some-account-id',
                date: 0,
              },
            ],
          }
        : {},
    );

    const wsConnectionHolder = mockWsConnectionHolder();
    const mockWsProvider = {
      getWsConnectionHolder: jest.fn(() => wsConnectionHolder),
    } as any;
    const nextDispatch = jest.fn();

    return {
      mockWsProvider,
      wsConnectionHolder,
      store,
      nextDispatch,
      tenant,
      eventEmitter: mockPopupUploadEventEmitter(),
    };
  };

  beforeEach(() => {
    jest
      .spyOn(uuid, 'v4')
      .mockReturnValueOnce('uuid1')
      .mockReturnValueOnce('uuid2')
      .mockReturnValueOnce('uuid3')
      .mockReturnValueOnce('uuid4');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call next dispatch if action is START_IMPORT', () => {
    const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();

    const action = startImport();
    importFilesMiddleware(eventEmitter, mockWsProvider)(store)(nextDispatch)(
      action,
    );
    expect(nextDispatch).toBeCalledWith(action);
  });

  it('should call next dispatch even if action is not START_IMPORT', () => {
    const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();

    const action = resetView();
    importFilesMiddleware(eventEmitter, mockWsProvider)(store)(nextDispatch)(
      action,
    );
    expect(nextDispatch).toBeCalledWith(action);
  });

  describe('when START_IMPORT action supplied', () => {
    const action = startImport();

    it('should emit uploads-start event back to container for all selected items', () => {
      const { eventEmitter, mockWsProvider, store } = setup();

      return importFiles(eventEmitter, store, mockWsProvider).then(() => {
        expect(eventEmitter.emitUploadsStart).toBeCalledWith([
          {
            id: 'uuid1',
            name: 'picture1.jpg',
            type: 'image/jpg',
            size: 43,
            creationDate: todayDate,
            upfrontId,
          },
          {
            id: 'uuid2',
            name: 'picture3.jpg',
            type: 'image/jpg',
            size: 45,
            creationDate: todayDate,
            upfrontId,
          },
          {
            id: 'uuid3',
            name: 'picture4.jpg',
            type: 'image/jpg',
            size: 46,
            creationDate: todayDate,
            upfrontId,
          },
          {
            id: 'uuid4',
            name: 'picture5.jpg',
            type: 'image/jpg',
            size: 47,
            creationDate: expect.any(Number),
            upfrontId,
          },
        ]);
      });
    });

    it('should close popup', () => {
      const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();
      importFilesMiddleware(eventEmitter, mockWsProvider)(store)(nextDispatch)(
        action,
      );

      expect(store.dispatch).toHaveBeenCalledWith(hidePopup());
    });

    describe('each selected and recent file', () => {
      it('should dispatch GET_PREVIEW action', () => {
        const { eventEmitter, mockWsProvider, store } = setup();

        return importFiles(eventEmitter, store, mockWsProvider).then(() => {
          expect(store.dispatch).toBeCalledWith(
            getPreview(
              'uuid3',
              {
                id: 'some-selected-item-id-4',
                name: 'picture4.jpg',
                type: 'image/jpg',
                size: 46,
                creationDate: todayDate,
                upfrontId,
              },
              RECENTS_COLLECTION,
            ),
          );
        });
      });
    });

    describe('each selected and locally uploaded file', () => {
      it('should dispatch FINALIZE_UPLOAD action', () => {
        const { eventEmitter, mockWsProvider, store, tenant } = setup();

        return importFiles(eventEmitter, store, mockWsProvider).then(() => {
          const localUploadsFinalizedNum = 2;
          const recentFinalizedNum = 1;
          const isFinalizeUploadCall = (call: Action[]) =>
            call[0].type === 'FINALIZE_UPLOAD';

          expect(
            store.dispatch.mock.calls.filter(isFinalizeUploadCall),
          ).toHaveLength(localUploadsFinalizedNum + recentFinalizedNum);

          expect(store.dispatch).toBeCalledWith(
            expect.objectContaining({
              file: expect.objectContaining({
                name: 'picture1.jpg',
              }),
            }),
          );

          expect(store.dispatch).toBeCalledWith(
            expect.objectContaining({
              file: expect.objectContaining({
                name: 'picture3.jpg',
              }),
            }),
          );

          expect(store.dispatch).toBeCalledWith(
            finalizeUpload(
              {
                id: 'some-selected-item-id-4',
                name: 'picture4.jpg',
                type: 'image/jpg',
                size: 46,
                creationDate: todayDate,
                upfrontId,
              },
              'uuid3',
              {
                id: 'some-selected-item-id-4',
                collection: RECENTS_COLLECTION,
              },
              tenant,
            ),
          );
        });
      });

      it('should bobble up some events', done => {
        const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();
        importFilesMiddleware(eventEmitter, mockWsProvider)(store)(
          nextDispatch,
        )(action);

        setImmediate(() => {
          const sendUploadEventsCalls = getSendUploadEventPayloads(
            store,
            'upload-preview-update',
          );

          expect(sendUploadEventsCalls).toHaveLength(2);
          let firstEvent = sendUploadEventsCalls[0]
            .event as UploadPreviewUpdateEvent;
          let secondEvent = sendUploadEventsCalls[1]
            .event as UploadPreviewUpdateEvent;
          expect(firstEvent.data.file.name).toEqual('picture1.jpg');
          expect(secondEvent.data.file.name).toEqual('picture3.jpg');
          done();
        });
      });

      it('should not bobble up other events', done => {
        const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();
        importFilesMiddleware(eventEmitter, mockWsProvider)(store)(
          nextDispatch,
        )(action);

        setImmediate(() => {
          expect(eventEmitter.emitUploadsStart).toHaveBeenCalledTimes(1);
          expect(
            getSendUploadEventPayloads(store, 'uploads-start'),
          ).toHaveLength(0);
          expect(getSendUploadEventPayloads(store, 'upload-end')).toHaveLength(
            0,
          );
          done();
        });
      });

      it('should dispatch SET_EVENT_PROXY action', done => {
        const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();
        importFilesMiddleware(eventEmitter, mockWsProvider)(store)(
          nextDispatch,
        )(action);

        setImmediate(() => {
          const setEventProxyCalls = getDispatchArgs(
            store,
            'SET_EVENT_PROXY',
          ) as SetEventProxyAction[];
          expect(setEventProxyCalls).toHaveLength(2);
          expect(setEventProxyCalls[0]).toEqual(
            setEventProxy('some-selected-item-id-1', 'uuid1'),
          );
          expect(setEventProxyCalls[1]).toEqual(
            setEventProxy('some-selected-item-id-3', 'uuid2'),
          );
          done();
        });
      });
    });

    describe('each selected and remote file', () => {
      it('should initiate the import with a websocket message', done => {
        const {
          eventEmitter,
          mockWsProvider,
          wsConnectionHolder,
          store,
          nextDispatch,
        } = setup();

        importFilesMiddleware(eventEmitter, mockWsProvider)(store)(
          nextDispatch,
        )(action);

        setImmediate(() => {
          expect(wsConnectionHolder.openConnection).toHaveBeenCalledTimes(1);
          expect(wsConnectionHolder.send).toHaveBeenCalledTimes(1);
          expect(wsConnectionHolder.send).toHaveBeenCalledWith({
            type: 'fetchFile',
            params: {
              serviceName: 'dropbox',
              accountId: 'some-account-id',
              fileId: 'some-selected-item-id-5',
              fileName: 'picture5.jpg',
              collection: RECENTS_COLLECTION,
              jobId: 'uuid4',
            },
          });
          done();
        });
      });
    });
  });

  describe('isRemoteService', () => {
    it('should return true for service name "dropbox"', () => {
      expect(isRemoteService('dropbox')).toEqual(true);
    });

    it('should return true for service name "google"', () => {
      expect(isRemoteService('google')).toEqual(true);
    });

    it('should return false for service name other than "dropbox" or "google"', () => {
      expect(isRemoteService('some-service')).toEqual(false);
    });
  });
});
