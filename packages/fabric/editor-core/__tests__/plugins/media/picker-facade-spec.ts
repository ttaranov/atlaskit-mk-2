import {
  DefaultMediaStateManager,
  MediaStateManager,
} from '@atlaskit/media-core';
import {
  Popup,
  Browser,
  Dropzone,
  Clipboard,
  BinaryUploader,
} from '@atlaskit/media-picker';
import {
  StoryBookAuthProvider,
  StoryBookUserAuthProvider,
} from '@atlaskit/media-test-helpers';

import PickerFacade from '../../../src/plugins/media/picker-facade';
import { ErrorReportingHandler } from '../../../src/utils';
import MockMediaPicker from './_mock-media-picker';

describe('Media PickerFacade', () => {
  let stateManager: MediaStateManager | undefined;
  let facade: PickerFacade | undefined;
  let mockPickerFactory: any;
  let mockPicker: MockMediaPicker;
  const dropzoneContainer = document.createElement('div');
  const uploadParams = {
    collection: 'mock',
    dropzoneContainer,
  };
  const contextConfig = {
    serviceHost: 'http://test',
    authProvider: StoryBookAuthProvider.create(false),
    userAuthProvider: StoryBookUserAuthProvider.create(),
  };
  const testFileId = `${Math.round(Math.random() * 100000)}`;
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
  const errorReporter: ErrorReportingHandler = {
    captureException: (err: any) => {},
    captureMessage: (msg: any) => {},
  };
  const apiUrl = '';
  const authProvider = () => Promise.resolve({ clientId: '', token: '' });

  describe('Generic Picker', () => {
    beforeEach(() => {
      mockPicker = new MockMediaPicker();
      stateManager = new DefaultMediaStateManager();
      mockPickerFactory = (pickerType, moduleConfig, componentConfig?) => {
        mockPicker.pickerType = pickerType;
        mockPicker.moduleConfig = moduleConfig;
        mockPicker.componentConfig = componentConfig;

        return mockPicker;
      };
      facade = new PickerFacade(
        'popup',
        uploadParams,
        contextConfig,
        stateManager,
        errorReporter,
        mockPickerFactory,
      );
    });

    afterEach(() => {
      stateManager = undefined;
      facade!.destroy();
      facade = undefined;
    });

    it('listens to picker events', () => {
      expect(Object.keys(mockPicker.listeners).length).toEqual(7);
      expect(mockPicker.listeners).toHaveProperty('uploads-start');
      expect(mockPicker.listeners).toHaveProperty('upload-preview-update');
      expect(mockPicker.listeners).toHaveProperty('upload-status-update');
      expect(mockPicker.listeners).toHaveProperty('upload-processing');
      expect(mockPicker.listeners).toHaveProperty('upload-finalize-ready');
      expect(mockPicker.listeners).toHaveProperty('upload-error');
      expect(mockPicker.listeners).toHaveProperty('upload-end');
    });

    it('removes listeners on destruction', () => {
      facade!.destroy();
      expect(Object.keys(mockPicker.listeners).length).toEqual(0);
    });

    describe('configures picker', () => {
      it('with correct upload params and context', () => {
        expect(mockPicker.pickerType).toEqual('popup');
        expect(mockPicker.moduleConfig).toHaveProperty(
          'uploadParams',
          uploadParams,
        );
        expect(mockPicker.moduleConfig).toHaveProperty(
          'apiUrl',
          contextConfig.serviceHost,
        );
        expect(mockPicker.moduleConfig).toHaveProperty(
          'authProvider',
          contextConfig.authProvider,
        );
      });

      it('respects dropzone component config', () => {
        const dropzoneFacade = new PickerFacade(
          'dropzone',
          uploadParams,
          contextConfig,
          stateManager!,
          errorReporter,
          mockPickerFactory,
        );
        expect(typeof dropzoneFacade).toBe('object');
        expect(mockPicker.componentConfig).toHaveProperty(
          'container',
          dropzoneContainer,
        );
      });

      it('respects popup component config', () => {
        const popupFacade = new PickerFacade(
          'popup',
          uploadParams,
          contextConfig,
          stateManager!,
          errorReporter,
          mockPickerFactory,
        );
        expect(typeof popupFacade).toBe('object');
        expect(mockPicker.componentConfig).toHaveProperty(
          'userAuthProvider',
          contextConfig.userAuthProvider,
        );
      });

      it('fallbacks to browser picker if userAuthProvider is not provided', () => {
        const contextConfigWithoutUserAuthProvider = {
          serviceHost: 'http://test',
          authProvider: StoryBookAuthProvider.create(false),
        };
        const popupFacade = new PickerFacade(
          'popup',
          uploadParams,
          contextConfigWithoutUserAuthProvider,
          stateManager!,
          errorReporter,
          mockPickerFactory,
        );
        expect(typeof popupFacade).toBe('object');
        expect(mockPicker.pickerType).toEqual('browser');
      });
    });

    describe('proxies events to MediaStateManager', () => {
      it('for upload starting', () => {
        const cb = jest.fn();
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('uploads-start', {
          files: [testFileData],
        });
        expect(cb).toHaveBeenCalledWith({
          id: testTemporaryFileId,
          status: 'uploading',
          fileName: testFileData.name,
          fileSize: testFileData.size,
          fileMimeType: testFileData.type,
        });
      });

      it('for new uploads via onNewMedia()', () => {
        const cb = jest.fn();
        facade!.onNewMedia(cb);

        mockPicker.__triggerEvent('uploads-start', {
          files: [testFileData],
        });
        expect(cb).toHaveBeenCalledWith([
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
        const cb = jest.fn();
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-status-update', {
          file: testFileData,
          progress: testFileProgress,
        });
        expect(cb).toHaveBeenCalledWith({
          id: testTemporaryFileId,
          status: 'uploading',
          progress: testFileProgress.portion,
          fileName: testFileData.name,
          fileSize: testFileData.size,
          fileMimeType: testFileData.type,
        });
      });

      it('for upload preview availability', () => {
        const cb = jest.fn();
        const preview = { src: '' };
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-preview-update', {
          file: testFileData,
          preview,
        });
        expect(cb.mock.calls[0][0]).toMatchObject({
          id: testTemporaryFileId,
          thumbnail: preview,
        });
      });

      it('for upload processing', () => {
        const cb = jest.fn();
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-processing', {
          file: { ...testFileData, publicId: testFilePublicId },
        });
        expect(cb).toHaveBeenCalledWith({
          id: testTemporaryFileId,
          status: 'processing',
          fileName: testFileData.name,
          fileSize: testFileData.size,
          fileMimeType: testFileData.type,
        });
      });

      it('for upload ready for finalization', () => {
        const cb = jest.fn();
        const finalizeCb = () => {};
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-finalize-ready', {
          file: { ...testFileData },
          finalize: finalizeCb,
        });
        expect(cb).toHaveBeenCalledWith({
          id: testTemporaryFileId,
          status: 'unfinalized',
          finalizeCb: finalizeCb,
          fileName: testFileData.name,
          fileSize: testFileData.size,
          fileMimeType: testFileData.type,
        });
      });

      it('for upload error', () => {
        const cb = jest.fn();
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-error', {
          error: {
            name: 'some-error',
            description: 'something went wrong',
            fileId: testFileData.id,
          },
        } as any);
        expect(cb).toHaveBeenCalledWith({
          id: testTemporaryFileId,
          status: 'error',
          error: {
            name: 'some-error',
            description: 'something went wrong',
          },
        });
      });

      it('for upload end', () => {
        const cb = jest.fn();
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-end', {
          file: { ...testFileData, publicId: testFilePublicId },
          public: { id: 'test-id' },
        });
        expect(cb).toHaveBeenCalledWith({
          id: testTemporaryFileId,
          publicId: testFilePublicId,
          status: 'ready',
          fileName: testFileData.name,
          fileSize: testFileData.size,
          fileMimeType: testFileData.type,
        });
      });
    });

    it('After upload has transitioned from "uploading", subsequent "status update" events must not downgrade status (ED-2062)', () => {
      const finalizeCb = () => {};
      stateManager!.updateState(testTemporaryFileId, {
        id: testTemporaryFileId,
        status: 'uploading',
      });

      mockPicker.__triggerEvent('upload-finalize-ready', {
        file: { ...testFileData },
        finalize: finalizeCb,
      });

      mockPicker.__triggerEvent('upload-status-update', {
        file: { ...testFileData },
        progress: testFileProgress,
      });

      expect(stateManager!.getState(testTemporaryFileId)).toEqual({
        id: testTemporaryFileId,
        status: 'unfinalized',
        progress: testFileProgress.portion,
        fileName: testFileData.name,
        fileSize: testFileData.size,
        fileMimeType: testFileData.type,
        finalizeCb: finalizeCb,
      });

      mockPicker.__triggerEvent('upload-processing', {
        file: { ...testFileData, publicId: testFilePublicId },
      });

      mockPicker.__triggerEvent('upload-status-update', {
        file: testFileData,
        progress: testFileProgress,
      });

      expect(stateManager!.getState(testTemporaryFileId)!.status).toEqual(
        'processing',
      );

      mockPicker.__triggerEvent('upload-end', {
        file: { ...testFileData, publicId: testFilePublicId },
        public: { id: 'test-id' },
      });

      mockPicker.__triggerEvent('upload-status-update', {
        file: testFileData,
        progress: testFileProgress,
      });

      expect(stateManager!.getState(testTemporaryFileId)!.status).toEqual(
        'ready',
      );
    });
  });

  describe('Popup Picker', () => {
    const mockPopupPicker = new Popup(
      { trackEvent: () => {} },
      { apiUrl, authProvider },
      { userAuthProvider: authProvider, container: document.body },
    );

    beforeEach(() => {
      stateManager = new DefaultMediaStateManager();
      mockPickerFactory = (
        pickerType: string,
        pickerConfig: any,
        extraConfig?: any,
      ) => mockPopupPicker;
      facade = new PickerFacade(
        'popup',
        uploadParams,
        contextConfig,
        stateManager,
        errorReporter,
        mockPickerFactory,
      );
    });

    afterEach(() => {
      stateManager = undefined;
      facade!.destroy();
      facade = undefined;
    });

    it(`calls picker's teardown() on destruction`, () => {
      const spy = (mockPopupPicker.teardown = jest.fn());
      facade!.destroy();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it(`calls picker's show() on show`, () => {
      const spy = (mockPopupPicker.show = jest.fn());
      facade!.show();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it(`calls picker's hide() on hide`, () => {
      const spy = (mockPopupPicker.hide = jest.fn());
      facade!.hide();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('for upload that has been cancelled', () => {
      const spy = jest.fn();
      stateManager!.updateState(testTemporaryFileId, {
        id: testTemporaryFileId,
        status: 'uploading',
      });

      stateManager!.subscribe(testTemporaryFileId, spy);
      facade!.cancel(testTemporaryFileId);

      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith({
        id: testTemporaryFileId,
        status: 'cancelled',
      });
    });
  });

  describe('Browser Picker', () => {
    const mockBrowserPicker = new Browser(
      { trackEvent() {} },
      { apiUrl, authProvider },
    );

    beforeEach(() => {
      stateManager = new DefaultMediaStateManager();
      mockPickerFactory = (
        pickerType: string,
        pickerConfig: any,
        extraConfig?: any,
      ) => mockBrowserPicker;
      facade = new PickerFacade(
        'browser',
        uploadParams,
        contextConfig,
        stateManager,
        errorReporter,
        mockPickerFactory,
      );
    });

    afterEach(() => {
      stateManager = undefined;
      facade!.destroy();
      facade = undefined;
    });

    it(`calls picker's teardown() on destruction`, () => {
      const spy = (mockBrowserPicker.teardown = jest.fn());
      facade!.destroy();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it(`calls picker's browse() on show`, () => {
      const spy = (mockBrowserPicker.browse = jest.fn());
      facade!.show();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Clipboard Picker', () => {
    const mockClipboardPicker = new Clipboard(
      { trackEvent() {} },
      { apiUrl, authProvider },
    );
    const activateSpy = (mockClipboardPicker.activate = jest.fn());

    beforeEach(() => {
      stateManager = new DefaultMediaStateManager();
      mockPickerFactory = (
        pickerType: string,
        pickerConfig: any,
        extraConfig?: any,
      ) => mockClipboardPicker;
      facade = new PickerFacade(
        'clipboard',
        uploadParams,
        contextConfig,
        stateManager,
        errorReporter,
        mockPickerFactory,
      );
    });

    afterEach(() => {
      stateManager = undefined;
      facade!.destroy();
      facade = undefined;
    });

    it('activates picker upon construction', () => {
      expect(activateSpy).toHaveBeenCalledTimes(1);
    });

    it(`calls picker's deactivate() on destruction`, () => {
      const spy = jest.fn();
      mockClipboardPicker.deactivate = spy;
      facade!.destroy();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Dropzone Picker', () => {
    const mockDropzonePicker = new Dropzone(
      { trackEvent() {} },
      { apiUrl, authProvider },
    );
    const activateSpy = (mockDropzonePicker.activate = jest.fn());

    beforeEach(() => {
      stateManager = new DefaultMediaStateManager();
      mockPickerFactory = (
        pickerType: string,
        pickerConfig: any,
        extraConfig?: any,
      ) => mockDropzonePicker;
      facade = new PickerFacade(
        'dropzone',
        uploadParams,
        contextConfig,
        stateManager,
        errorReporter,
        mockPickerFactory,
      );
    });

    afterEach(() => {
      stateManager = undefined;
      facade!.destroy();
      facade = undefined;
    });

    it('activates picker upon construction', () => {
      expect(activateSpy).toHaveBeenCalledTimes(1);
    });

    it(`calls picker's deactivate() on destruction`, () => {
      const spy = (mockDropzonePicker.deactivate = jest.fn());
      facade!.destroy();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

  describe('BinaryUploader Picker', () => {
    const mockBinaryUploaderPicker = new BinaryUploader(
      { trackEvent() {} },
      { apiUrl, authProvider },
    );

    beforeEach(() => {
      stateManager = new DefaultMediaStateManager();
      mockPickerFactory = (
        pickerType: string,
        pickerConfig: any,
        extraConfig?: any,
      ) => mockBinaryUploaderPicker;
      facade = new PickerFacade(
        'binary',
        uploadParams,
        contextConfig,
        stateManager,
        errorReporter,
        mockPickerFactory,
      );
    });

    afterEach(() => {
      stateManager = undefined;
      facade!.destroy();
      facade = undefined;
    });

    it(`calls picker's upload() on upload`, () => {
      const spy = (mockBinaryUploaderPicker.upload = jest.fn());
      const url = 'https://atlassian.com/file.ext';
      const fileName = 'file.ext';
      facade!.upload(url, fileName);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(url, fileName);
    });
  });
});
