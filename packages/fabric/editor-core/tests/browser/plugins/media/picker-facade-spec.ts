import * as chai from 'chai';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';

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
} from 'mediapicker';
import { StoryBookAuthProvider, StoryBookUserAuthProvider } from '@atlaskit/media-test-helpers';

import {
  chaiPlugin
} from '../../../../src/test-helper';
import PickerFacade from '../../../../src/plugins/media/picker-facade';
import { ErrorReportingHandler } from '../../../../src/utils';
import MockMediaPicker from './mock-media-picker';

chai.use(chaiPlugin);
chai.use(chaiAsPromised);

describe('Media PickerFacade', () => {
  let stateManager: MediaStateManager | undefined;
  let facade: PickerFacade | undefined;
  let mockPickerFactory: any;
  let mockPicker: MockMediaPicker;
  const dropzoneContainer = document.createElement('div');
  const uploadParams = {
    collection: 'mock',
    dropzoneContainer
  };
  const contextConfig = {
    serviceHost: 'http://test',
    authProvider: StoryBookAuthProvider.create(false),
    userAuthProvider: StoryBookUserAuthProvider.create()
  };
  const testFileId = `${Math.round(Math.random() * 100000)}`;
  const testTemporaryFileId = `temporary:${testFileId}`;
  const testFilePublicId = '7899d969-c1b2-4460-ad3e-44d51ac85452';
  const testFileData = {
    id: testFileId,
    name: 'test name',
    size: Math.round(Math.random() * 1047552),
    type: 'test/file',
    creationDate: (new Date().getTime()),
    toPureJSON: () => ({}),
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
    captureException: (err: any) => { },
    captureMessage: (msg: any) => { },
  };

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
      facade = new PickerFacade('popup', uploadParams, contextConfig, stateManager, errorReporter, mockPickerFactory);
    });

    afterEach(() => {
      stateManager = undefined;
      facade!.destroy();
      facade = undefined;
    });

    it('listens to picker events', () => {
      expect(Object.keys(mockPicker.listeners).length).to.equal(7);
      expect(mockPicker.listeners).to.have.property('upload-start');
      expect(mockPicker.listeners).to.have.property('upload-preview-update');
      expect(mockPicker.listeners).to.have.property('upload-status-update');
      expect(mockPicker.listeners).to.have.property('upload-processing');
      expect(mockPicker.listeners).to.have.property('upload-finalize-ready');
      expect(mockPicker.listeners).to.have.property('upload-error');
      expect(mockPicker.listeners).to.have.property('upload-end');
    });

    it('removes listeners on destruction', () => {
      facade!.destroy();
      expect(Object.keys(mockPicker.listeners).length).to.equal(0);
    });

    describe('configures picker', () => {
      it('with correct upload params and context', () => {
        expect(mockPicker.pickerType).to.eq('popup');
        expect(mockPicker.moduleConfig).to.have.property('uploadParams', uploadParams);
        expect(mockPicker.moduleConfig).to.have.property('apiUrl', contextConfig.serviceHost);
        expect(mockPicker.moduleConfig).to.have.property('authProvider', contextConfig.authProvider);
      });

      it('respects dropzone component config', () => {
        const dropzoneFacade = new PickerFacade('dropzone', uploadParams, contextConfig, stateManager!, errorReporter, mockPickerFactory);
        expect(dropzoneFacade).to.be.an('object');
        expect(mockPicker.componentConfig).to.have.property('container', dropzoneContainer);
      });

      it('respects popup component config', () => {
        const popupFacade = new PickerFacade('popup', uploadParams, contextConfig, stateManager!, errorReporter, mockPickerFactory);
        expect(popupFacade).to.be.an('object');
        expect(mockPicker.componentConfig).to.have.property('userAuthProvider', contextConfig.userAuthProvider);
      });

      it('fallbacks to browser picker if userAuthProvider is not provided', () => {
        const contextConfigWithoutUserAuthProvider = {
          serviceHost: 'http://test',
          authProvider: StoryBookAuthProvider.create(false)
        };
        const popupFacade = new PickerFacade('popup', uploadParams, contextConfigWithoutUserAuthProvider, stateManager!, errorReporter, mockPickerFactory);
        expect(popupFacade).to.be.an('object');
        expect(mockPicker.pickerType).to.eq('browser');
      });
    });

    describe('proxies events to MediaStateManager', () => {
      it('for upload starting', () => {
        const cb = sinon.spy();
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-start', {
          file: testFileData
        });
        expect(cb.calledWithExactly({
          id: testTemporaryFileId,
          status: 'uploading',
          fileName: testFileData.name,
          fileSize: testFileData.size,
          fileMimeType: testFileData.type,
        })).to.eq(true);
      });

      it('for new uploads via onNewMedia()', () => {
        const cb = sinon.spy();
        facade!.onNewMedia(cb);

        mockPicker.__triggerEvent('upload-start', {
          file: testFileData
        });
        expect(cb.calledWithExactly({
          id: testTemporaryFileId,
          status: 'uploading',
          fileName: testFileData.name,
          fileSize: testFileData.size,
          fileMimeType: testFileData.type,
        })).to.eq(true);
      });

      it('for upload progress', () => {
        const cb = sinon.spy();
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-status-update', {
          file: testFileData,
          progress: testFileProgress,
        });
        expect(cb.calledWithExactly({
          id: testTemporaryFileId,
          status: 'uploading',
          progress: testFileProgress.portion,
          fileName: testFileData.name,
          fileSize: testFileData.size,
          fileMimeType: testFileData.type,
        })).to.eq(true);
      });

      it('for upload preview availability', () => {
        const cb = sinon.spy();
        const preview = new Blob();
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-preview-update', {
          file: testFileData,
          preview
        });
        expect(cb.calledWithExactly({
          id: testTemporaryFileId,
          thumbnail: preview
        })).to.eq(true);
      });

      it('for upload processing', () => {
        const cb = sinon.spy();
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-processing', {
          file: { ...testFileData, publicId: testFilePublicId },
        });
        expect(cb.calledWithExactly({
          id: testTemporaryFileId,
          publicId: testFilePublicId,
          status: 'processing',
          fileName: testFileData.name,
          fileSize: testFileData.size,
          fileMimeType: testFileData.type,
        })).to.eq(true);
      });

      it('for upload ready for finalization', () => {
        const cb = sinon.spy();
        const finalizeCb = () => { };
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-finalize-ready', {
          file: { ...testFileData, publicId: testFilePublicId },
          finalize: finalizeCb
        });
        expect(cb.calledWithExactly({
          id: testTemporaryFileId,
          publicId: testFilePublicId,
          status: 'unfinalized',
          finalizeCb: finalizeCb,
          fileName: testFileData.name,
          fileSize: testFileData.size,
          fileMimeType: testFileData.type,
        })).to.eq(true);
      });

      it('for upload error', () => {
        const cb = sinon.spy();
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-error', {
          error: {
            name: 'some-error',
            description: 'something went wrong',
            fileId: testFileData.id,
          }
        } as any);
        expect(cb.calledWithExactly({
          id: testTemporaryFileId,
          status: 'error',
          error: {
            name: 'some-error',
            description: 'something went wrong'
          },
        })).to.eq(true);
      });

      it('for upload end', () => {
        const cb = sinon.spy();
        stateManager!.subscribe(testTemporaryFileId, cb);
        mockPicker.__triggerEvent('upload-end', {
          file: { ...testFileData, publicId: testFilePublicId }, public: { id: 'test-id' },
        });
        expect(cb.calledWithExactly({
          id: testTemporaryFileId,
          publicId: testFilePublicId,
          status: 'ready',
          fileName: testFileData.name,
          fileSize: testFileData.size,
          fileMimeType: testFileData.type,
        })).to.eq(true);
      });
    });

    it('After upload has transitioned from "uploading", subsequent "status update" events must not downgrade status (ED-2062)', () => {
      const finalizeCb = () => { };
      stateManager!.updateState(testTemporaryFileId, {
        id: testTemporaryFileId,
        status: 'uploading'
      });

      mockPicker.__triggerEvent('upload-finalize-ready', {
        file: { ...testFileData, publicId: testFilePublicId },
        finalize: finalizeCb
      });

      mockPicker.__triggerEvent('upload-status-update', {
        file: testFileData,
        progress: testFileProgress,
      });

      expect(stateManager!.getState(testTemporaryFileId)).to.deep.eq({
        id: testTemporaryFileId,
        publicId: testFilePublicId,
        status: 'unfinalized',
        progress: testFileProgress.portion,
        fileName: testFileData.name,
        fileSize: testFileData.size,
        fileMimeType: testFileData.type,
        finalizeCb: finalizeCb
      });

      mockPicker.__triggerEvent('upload-processing', {
        file: { ...testFileData, publicId: testFilePublicId },
      });

      mockPicker.__triggerEvent('upload-status-update', {
        file: testFileData,
        progress: testFileProgress,
      });

      expect(stateManager!.getState(testTemporaryFileId)!.status).to.eq('processing');

      mockPicker.__triggerEvent('upload-end', {
        file: { ...testFileData, publicId: testFilePublicId }, public: { id: 'test-id' },
      });

      mockPicker.__triggerEvent('upload-status-update', {
        file: testFileData,
        progress: testFileProgress,
      });

      expect(stateManager!.getState(testTemporaryFileId)!.status).to.eq('ready');
    });
  });

  describe('Popup Picker', () => {
    const mockPopupPicker = sinon.createStubInstance(Popup);
    beforeEach(() => {
      stateManager = new DefaultMediaStateManager();
      mockPickerFactory = (pickerType: string, pickerConfig: any, extraConfig?: any) => mockPopupPicker;
      facade = new PickerFacade('popup', uploadParams, contextConfig, stateManager, errorReporter, mockPickerFactory);
    });

    afterEach(() => {
      stateManager = undefined;
      facade!.destroy();
      facade = undefined;
    });

    it(`calls picker's teardown() on destruction`, () => {
      (mockPopupPicker as any).teardown.reset();
      facade!.destroy();
      sinon.assert.calledOnce((mockPopupPicker as any).teardown);
    });

    it(`calls picker's show() on show`, () => {
      (mockPopupPicker as any).show.reset();
      facade!.show();
      sinon.assert.calledOnce((mockPopupPicker as any).show);
    });

    it('for upload that has been cancelled', () => {
      const cb = sinon.spy();
      stateManager!.updateState(testTemporaryFileId, {
        id: testTemporaryFileId,
        status: 'uploading'
      });

      stateManager!.subscribe(testTemporaryFileId, cb);
      facade!.cancel(testTemporaryFileId);

      sinon.assert.calledOnce(cb);
      sinon.assert.calledWithExactly(cb, {
        id: testTemporaryFileId,
        status: 'cancelled'
      });
    });
  });

  describe('Browser Picker', () => {
    const mockBrowserPicker = sinon.createStubInstance(Browser);
    beforeEach(() => {
      stateManager = new DefaultMediaStateManager();
      mockPickerFactory = (pickerType: string, pickerConfig: any, extraConfig?: any) => mockBrowserPicker;
      facade = new PickerFacade('browser', uploadParams, contextConfig, stateManager, errorReporter, mockPickerFactory);
    });

    afterEach(() => {
      stateManager = undefined;
      facade!.destroy();
      facade = undefined;
    });

    it(`calls picker's teardown() on destruction`, () => {
      (mockBrowserPicker as any).teardown.reset();
      facade!.destroy();
      sinon.assert.calledOnce((mockBrowserPicker as any).teardown);
    });

    it(`calls picker's browse() on show`, () => {
      (mockBrowserPicker as any).browse.reset();
      facade!.show();
      sinon.assert.calledOnce((mockBrowserPicker as any).browse);
    });
  });

  describe('Clipboard Picker', () => {
    const mockClipboardPicker = sinon.createStubInstance(Clipboard);
    beforeEach(() => {
      stateManager = new DefaultMediaStateManager();
      mockPickerFactory = (pickerType: string, pickerConfig: any, extraConfig?: any) => mockClipboardPicker;
      facade = new PickerFacade('clipboard', uploadParams, contextConfig, stateManager, errorReporter, mockPickerFactory);
    });

    afterEach(() => {
      stateManager = undefined;
      facade!.destroy();
      facade = undefined;
    });

    it('activates picker upon construction', () => {
      sinon.assert.calledOnce((mockClipboardPicker as any).activate);
    });

    it(`calls picker's deactivate() on destruction`, () => {
      (mockClipboardPicker as any).deactivate.reset();
      facade!.destroy();
      sinon.assert.calledOnce((mockClipboardPicker as any).deactivate);
    });
  });

  describe('Dropzone Picker', () => {
    const mockDropzonePicker = sinon.createStubInstance(Dropzone);
    beforeEach(() => {
      stateManager = new DefaultMediaStateManager();
      mockPickerFactory = (pickerType: string, pickerConfig: any, extraConfig?: any) => mockDropzonePicker;
      facade = new PickerFacade('dropzone', uploadParams, contextConfig, stateManager, errorReporter, mockPickerFactory);
    });

    afterEach(() => {
      stateManager = undefined;
      facade!.destroy();
      facade = undefined;
    });

    it('activates picker upon construction', () => {
      sinon.assert.calledOnce((mockDropzonePicker as any).activate);
    });

    it(`calls picker's deactivate() on destruction`, () => {
      (mockDropzonePicker as any).deactivate.reset();
      facade!.destroy();
      sinon.assert.calledOnce((mockDropzonePicker as any).deactivate);
    });
  });

  describe('BinaryUploader Picker', () => {
    const mockBinaryUploaderPicker = sinon.createStubInstance(BinaryUploader);
    beforeEach(() => {
      stateManager = new DefaultMediaStateManager();
      mockPickerFactory = (pickerType: string, pickerConfig: any, extraConfig?: any) => mockBinaryUploaderPicker;
      facade = new PickerFacade('binary', uploadParams, contextConfig, stateManager, errorReporter, mockPickerFactory);
    });

    afterEach(() => {
      stateManager = undefined;
      facade!.destroy();
      facade = undefined;
    });

    it(`calls picker's upload() on upload`, () => {
      (mockBinaryUploaderPicker as any).upload.reset();
      const url = 'https://atlassian.com/file.ext';
      const fileName = 'file.ext';
      facade!.upload(url, fileName);
      sinon.assert.calledOnce((mockBinaryUploaderPicker as any).upload);
      sinon.assert.calledWithExactly((mockBinaryUploaderPicker as any).upload, url, fileName);
    });
  });
});
