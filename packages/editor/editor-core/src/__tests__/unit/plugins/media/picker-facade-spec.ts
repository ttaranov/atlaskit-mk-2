jest.mock('@atlaskit/media-picker');

import {
  MediaPicker,
  Popup,
  Browser,
  Dropzone,
  Clipboard,
  BinaryUploader,
  UploadsStartEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadStatusUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadErrorEventPayload,
  UploadEndEventPayload,
} from '@atlaskit/media-picker';
import { ContextFactory } from '@atlaskit/media-core';
import {
  StoryBookAuthProvider,
  userAuthProvider,
} from '@atlaskit/media-test-helpers';
import { randomId } from '@atlaskit/editor-test-helpers';

import {
  DefaultMediaStateManager,
  MediaStateManager,
} from '../../../../plugins/media';
import PickerFacade, {
  PickerType,
  PickerFacadeConfig,
} from '../../../../plugins/media/picker-facade';
import { ErrorReportingHandler } from '../../../../utils';

describe('Media PickerFacade', () => {
  const errorReporter: ErrorReportingHandler = {
    captureException: (err: any) => {},
    captureMessage: (msg: any) => {},
  };

  const context = ContextFactory.create({
    authProvider: StoryBookAuthProvider.create(false),
    userAuthProvider,
  });

  const getPickerFacadeConfig = (
    stateManager: MediaStateManager,
  ): PickerFacadeConfig => ({
    context,
    stateManager,
    errorReporter,
  });

  const testFileId = randomId();
  const testTemporaryFileId = `temporary:${testFileId}`;
  const testFilePublicId = '7899d969-c1b2-4460-ad3e-44d51ac85452';
  const testFileData = {
    id: testFileId,
    name: 'test name',
    size: Math.round(Math.random() * 1047552),
    type: 'test/file',
    creationDate: new Date().getTime(),
  };
  const testFileProgress = {
    absolute: 1,
    portion: Math.random(),
    max: 1,
    overallTime: 1,
    expectedFinishTime: 1,
    timeLeft: 1,
  };
  const preview = { src: '' };

  // Spies
  const spies = {
    on: jest.fn(),
    removeAllListeners: jest.fn(),
    teardown: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    deactivate: jest.fn(),
    upload: jest.fn(),
    activate: jest.fn(),
    browse: jest.fn(),
  };

  // Helpers
  function triggerStart(payload?: Partial<UploadsStartEventPayload>) {
    // [ 'uploads-start', [Function] ]
    const [eventName, cb] = spies.on.mock.calls[0];
    cb({ files: [testFileData], ...payload });
    // Just to make sure we are call the correct callback
    expect(eventName).toBe('uploads-start');
  }

  function triggerPreviewUpdate(
    payload?: Partial<UploadPreviewUpdateEventPayload>,
  ) {
    const [eventName, cb] = spies.on.mock.calls[1];
    cb({
      file: testFileData,
      preview,
      ...payload,
    });
    expect(eventName).toBe('upload-preview-update');
  }

  function triggerProcessing(payload?: Partial<UploadProcessingEventPayload>) {
    const [eventName, cb] = spies.on.mock.calls[2];
    cb({
      file: { ...testFileData, publicId: testFilePublicId },
      ...payload,
    });
    expect(eventName).toBe('upload-processing');
  }

  function triggerStatusUpdate(
    payload?: Partial<UploadStatusUpdateEventPayload>,
  ) {
    const [eventName, cb] = spies.on.mock.calls[3];
    cb({
      file: testFileData,
      progress: testFileProgress,
      ...payload,
    });
    expect(eventName).toBe('upload-status-update');
  }

  function triggerError(payload?: Partial<UploadErrorEventPayload>) {
    const [eventName, cb] = spies.on.mock.calls[4];
    cb({
      error: {
        name: 'some-error',
        description: 'something went wrong',
        fileId: testFileData.id,
      },
      ...payload,
    });
    expect(eventName).toBe('upload-error');
  }

  function triggerEnd(payload?: Partial<UploadEndEventPayload>) {
    const [eventName, cb] = spies.on.mock.calls[5];
    cb({
      file: { ...testFileData, publicId: testFilePublicId },
      public: { id: 'test-id' },
      payload,
    });
    expect(eventName).toBe('upload-end');
  }

  const pickerTypes: Array<PickerType> = [
    'popup',
    'binary',
    'clipboard',
    'dropzone',
    'browser',
  ];

  const pickerConstructors = {
    popup: Popup,
    binary: BinaryUploader,
    clipboard: Clipboard,
    dropzone: Dropzone,
    browser: Browser,
  };

  pickerTypes.forEach(pickerType => {
    describe(`Picker: ${pickerType}`, () => {
      let stateManager: MediaStateManager;
      let facade: PickerFacade;

      beforeEach(() => {
        Object.keys(spies).forEach(k => spies[k].mockClear());

        function MockPopup(this: any) {
          Object.keys(spies).forEach(k => (this[k] = spies[k]));
        }

        (MediaPicker as any).mockImplementation((...args) => {
          MockPopup.prototype = new (pickerConstructors[pickerType] as any)(
            ...args,
          );
          return new MockPopup();
        });

        stateManager = new DefaultMediaStateManager();
        facade = new PickerFacade(
          pickerType,
          getPickerFacadeConfig(stateManager),
          {
            uploadParams: { collection: '' },
          },
        );
      });

      afterEach(() => {
        facade.destroy();
        stateManager.destroy();
      });

      it(`listens to picker events`, () => {
        const fn = jasmine.any(Function);
        expect(spies.on).toHaveBeenCalledTimes(
          pickerType === 'dropzone' ? 8 : 6,
        );
        expect(spies.on).toHaveBeenCalledWith('uploads-start', fn);
        expect(spies.on).toHaveBeenCalledWith('upload-preview-update', fn);
        expect(spies.on).toHaveBeenCalledWith('upload-processing', fn);
        expect(spies.on).toHaveBeenCalledWith('upload-status-update', fn);
        expect(spies.on).toHaveBeenCalledWith('upload-error', fn);
        expect(spies.on).toHaveBeenCalledWith('upload-end', fn);

        if (pickerType === 'dropzone') {
          expect(spies.on).toHaveBeenCalledWith('drag-enter', fn);
          expect(spies.on).toHaveBeenCalledWith('drag-leave', fn);
        }
      });

      it('removes listeners on destruction', () => {
        facade.destroy();
        expect(spies.removeAllListeners).toHaveBeenCalledTimes(
          pickerType === 'dropzone' ? 8 : 6,
        );
        expect(spies.removeAllListeners).toHaveBeenCalledWith('uploads-start');
        expect(spies.removeAllListeners).toHaveBeenCalledWith(
          'upload-preview-update',
        );
        expect(spies.removeAllListeners).toHaveBeenCalledWith(
          'upload-processing',
        );
        expect(spies.removeAllListeners).toHaveBeenCalledWith(
          'upload-status-update',
        );
        expect(spies.removeAllListeners).toHaveBeenCalledWith('upload-error');
        expect(spies.removeAllListeners).toHaveBeenCalledWith('upload-end');

        if (pickerType === 'dropzone') {
          expect(spies.removeAllListeners).toHaveBeenCalledWith('drag-enter');
          expect(spies.removeAllListeners).toHaveBeenCalledWith('drag-leave');
        }
      });

      describe('proxies events to MediaStateManager', () => {
        const spy = jest.fn();

        beforeEach(() => {
          spy.mockClear();
          stateManager.on(testTemporaryFileId, spy);
        });

        it('should for upload starting', () => {
          triggerStart();
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith({
            id: testTemporaryFileId,
            status: 'uploading',
            fileName: testFileData.name,
            fileSize: testFileData.size,
            fileMimeType: testFileData.type,
          });
        });

        it('for new uploads via onNewMedia()', () => {
          const spy = jest.fn();
          facade.onNewMedia(spy);

          triggerStart();

          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith([
            {
              id: testTemporaryFileId,
              status: 'uploading',
              publicId: undefined,
              fileName: testFileData.name,
              fileSize: testFileData.size,
              fileMimeType: testFileData.type,
            },
          ]);
        });

        it('for upload progress', () => {
          triggerStatusUpdate();
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith({
            status: 'uploading',
            progress: testFileProgress.portion,
          });
        });

        it('for upload preview availability', () => {
          triggerPreviewUpdate();
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy.mock.calls[0][0]).toMatchObject({
            thumbnail: preview,
          });
        });

        it('for upload processing', () => {
          triggerProcessing();
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith({
            status: 'processing',
            publicId: testFilePublicId,
          });
        });

        it('for upload error', () => {
          triggerError();
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith({
            id: testTemporaryFileId,
            status: 'error',
            error: {
              name: 'some-error',
              description: 'something went wrong',
            },
          });
        });

        it('for upload end', () => {
          triggerEnd();
          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith({
            publicId: testFilePublicId,
            status: 'ready',
            progress: 1,
            ready: true,
          });
        });
      });

      // @see ED-2062
      it('After upload has transitioned from "uploading", subsequent "status update" events must not downgrade status', () => {
        stateManager.updateState(testTemporaryFileId, {
          id: testTemporaryFileId,
          status: 'uploading',
        });

        triggerStatusUpdate();
        triggerProcessing();
        triggerStatusUpdate();

        expect(stateManager.getState(testTemporaryFileId)!.status).toBe(
          'processing',
        );

        triggerEnd();
        triggerStatusUpdate();

        expect(stateManager.getState(testTemporaryFileId)!.status).toEqual(
          'ready',
        );
      });

      // Picker Specific Tests
      if (pickerType === 'clipboard' || pickerType === 'dropzone') {
        it(`should call picker's activate() during initialization`, () => {
          expect(spies.activate).toHaveBeenCalledTimes(1);
        });
      } else {
        it(`shouldn't call picker's activate() during initialization`, () => {
          expect(spies.activate).toHaveBeenCalledTimes(0);
        });
      }

      if (pickerType === 'popup' || pickerType === 'browser') {
        it(`should call picker's teardown() on destruction`, () => {
          facade.destroy();
          expect(spies.teardown).toHaveBeenCalledTimes(1);
        });
      } else if (pickerType === 'clipboard' || pickerType === 'dropzone') {
        it(`should call picker's deactivate() on destruction`, () => {
          facade.destroy();
          expect(spies.deactivate).toHaveBeenCalledTimes(1);
        });
      } else {
        it(`shouldn't call picker's teardown() or deactivate() on destruction`, () => {
          facade.destroy();
          expect(spies.teardown).toHaveBeenCalledTimes(0);
          expect(spies.deactivate).toHaveBeenCalledTimes(0);
        });
      }

      if (pickerType === 'popup') {
        it(`should call picker's show() on destruction`, () => {
          facade.show();
          expect(spies.show).toHaveBeenCalledTimes(1);
        });
      } else if (pickerType === 'browser') {
        it(`should call picker's browse() on destruction`, () => {
          facade.show();
          expect(spies.browse).toHaveBeenCalledTimes(1);
        });
      } else {
        it(`shouldn't call picker's show() on destruction`, () => {
          facade.show();
          expect(spies.show).toHaveBeenCalledTimes(0);
        });
      }

      if (pickerType === 'popup') {
        it(`should call picker's hide() on destruction`, () => {
          facade.hide();
          expect(spies.hide).toHaveBeenCalledTimes(1);
        });
      } else {
        it(`shouldn't call picker's hide() on destruction`, () => {
          facade.hide();
          expect(spies.hide).toHaveBeenCalledTimes(0);
        });
      }

      if (pickerType === 'popup') {
        it(`should call picker on close when onClose is called`, () => {
          spies.on.mockClear();
          const closeCb = jest.fn();
          facade.onClose(closeCb);

          expect(spies.on).toHaveBeenCalledTimes(1);
          expect(spies.on).toHaveBeenCalledWith('closed', closeCb);
        });
      } else {
        it(`should not call picker on close when onClose is called`, () => {
          spies.on.mockClear();
          facade.onClose(() => {});
          expect(spies.on).toHaveBeenCalledTimes(0);
        });
      }

      if (pickerType === 'dropzone' || pickerType === 'clipboard') {
        it(`should call picker.activate when activate is called`, () => {
          spies.activate.mockClear();
          facade.activate();
          expect(spies.activate).toHaveBeenCalledTimes(1);
        });
      } else {
        it(`should not call picker.activate when activate is called`, () => {
          spies.activate.mockClear();
          facade.activate();
          expect(spies.activate).toHaveBeenCalledTimes(0);
        });
      }

      if (pickerType === 'dropzone' || pickerType === 'clipboard') {
        it(`should call picker.deactivate when deactivate is called`, () => {
          spies.deactivate.mockClear();
          facade.deactivate();
          expect(spies.deactivate).toHaveBeenCalledTimes(1);
        });
      } else {
        it(`should not call picker.deactivate when deactivate is called`, () => {
          spies.deactivate.mockClear();
          facade.deactivate();
          expect(spies.deactivate).toHaveBeenCalledTimes(0);
        });
      }

      if (pickerType === 'popup') {
        it('should change the status to cancelled on cancel', () => {
          const spy = jest.fn();
          stateManager.updateState(testTemporaryFileId, {
            id: testTemporaryFileId,
            status: 'uploading',
          });

          stateManager.on(testTemporaryFileId, spy);
          facade.cancel(testTemporaryFileId);

          expect(spy).toHaveBeenCalledTimes(1);
          expect(spy).toHaveBeenCalledWith({
            id: testTemporaryFileId,
            status: 'cancelled',
          });
        });
      }

      if (pickerType === 'binary') {
        it(`calls picker's upload() on destruction`, () => {
          const url = 'https://atlassian.com/file.ext';
          const fileName = 'file.ext';
          facade.upload(url, fileName);
          expect(spies.upload).toHaveBeenCalledTimes(1);
          expect(spies.upload).toHaveBeenCalledWith(url, fileName);
        });
      }
    });
  });
});
