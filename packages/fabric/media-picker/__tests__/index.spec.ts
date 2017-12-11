import { expect } from 'chai';
import * as chai from 'chai';
import * as sinon from 'sinon';
import * as sinonChai from 'sinon-chai';

import {
  MediaPicker,
  ModuleConfig,
  BinaryUploader,
  Browser,
  Dropzone,
  Clipboard,
  Popup,
} from '../src/index';

chai.use(sinonChai);

/**
 * These specs should describe the public API.
 */
describe('MediaPicker', () => {
  const container = document.createElement('div');
  const userAuthProvider = () =>
    Promise.resolve({ clientId: 'some-client-id', token: 'some-token' });
  const moduleConfig: ModuleConfig = {
    apiUrl: 'some-api-url',
    authProvider: () =>
      Promise.resolve({ clientId: 'some-client-id', token: 'some-token' }),
    uploadParams: {
      collection: 'some-collection',
    },
  };

  describe('binary', () => {
    it('should be instance of MediaPickerBinaryUploader given options', () => {
      const binary = MediaPicker('binary', moduleConfig);

      expect(binary).is.instanceof(BinaryUploader);
    });

    it('should be a class constructor given no options', () => {
      expect(MediaPicker('binary')).to.equal(BinaryUploader);
    });

    it('should be able to register listeners to generic upload events', () => {
      const binary = MediaPicker('binary', moduleConfig);
      binary.on('upload-status-update', payload => {});
      binary.on('upload-finalize-ready', payload => {});
      binary.on('upload-preview-update', payload => {});
      binary.on('upload-processing', payload => {});
      binary.on('upload-end', payload => {});
      binary.on('upload-error', payload => {});
    });
  });

  describe('browser', () => {
    it('should be instance of MediaPickerBrowser given just module config', () => {
      const browser = MediaPicker('browser', moduleConfig);

      expect(browser).is.instanceof(Browser);
    });

    it('should be instance of MediaPickerBrowser given moduleConfig and pickerConfig', () => {
      const browser = MediaPicker('browser', moduleConfig, {
        multiple: true,
        fileExtensions: ['image/jpeg', 'image/png'],
      });

      expect(browser).is.instanceof(Browser);
    });

    it('should be a class constructor given no options', () => {
      expect(MediaPicker('browser')).to.equal(Browser);
    });

    it('should be able to register listeners to generic upload events', () => {
      const browser = MediaPicker('browser', moduleConfig);

      browser.on('uploads-start', payload => {});
      browser.on('upload-status-update', payload => {});
      browser.on('upload-finalize-ready', payload => {});
      browser.on('upload-preview-update', payload => {});
      browser.on('upload-processing', payload => {});
      browser.on('upload-end', payload => {});
      browser.on('upload-error', payload => {});
    });
  });

  describe('clipboard', () => {
    it('should be instance of MediaPickerClipboard given options', () => {
      const clipboard = MediaPicker('clipboard', moduleConfig);

      expect(clipboard).is.instanceof(Clipboard);
    });

    it('should be a class constructor given no options', () => {
      expect(MediaPicker('clipboard')).to.equal(Clipboard);
    });

    it('should be able to register listeners to generic upload events', () => {
      const clipboard = MediaPicker('clipboard', moduleConfig);

      clipboard.on('uploads-start', payload => {});
      clipboard.on('upload-status-update', payload => {});
      clipboard.on('upload-finalize-ready', payload => {});
      clipboard.on('upload-preview-update', payload => {});
      clipboard.on('upload-processing', payload => {});
      clipboard.on('upload-end', payload => {});
      clipboard.on('upload-error', payload => {});
    });
  });

  describe('dropzone', () => {
    it('should be instance of MediaPickerDropzone given just moduleConfig', () => {
      const dropzone = MediaPicker('dropzone', moduleConfig);

      expect(dropzone).is.instanceof(Dropzone);
    });

    it('should be instance of MediaPickerDropzone given moduleConfig and pickerConfig', () => {
      const dropzone = MediaPicker('dropzone', moduleConfig, { container });

      expect(dropzone).is.instanceof(Dropzone);
    });

    it('should be a class constructor given no options', () => {
      expect(MediaPicker('dropzone')).to.equal(Dropzone);
    });

    it('should be able to register listeners to generic upload events', () => {
      const dropzone = MediaPicker('dropzone', moduleConfig);

      dropzone.on('uploads-start', payload => {});
      dropzone.on('upload-status-update', payload => {});
      dropzone.on('upload-finalize-ready', payload => {});
      dropzone.on('upload-preview-update', payload => {});
      dropzone.on('upload-processing', payload => {});
      dropzone.on('upload-end', payload => {});
      dropzone.on('upload-error', payload => {});
    });

    it('consumers should be able to listen for "drop", "drag-enter" and "drag-leave" events', () => {
      const dropzone = MediaPicker('dropzone', moduleConfig);

      dropzone.on('drop', () => {});
      dropzone.on('drag-enter', () => {});
      dropzone.on('drag-leave', () => {});
    });
  });

  describe('popup', () => {
    const popupConfig = { container, userAuthProvider };

    it('should be instance of MediaPickerPopup given options', () => {
      const popup = MediaPicker('popup', moduleConfig, popupConfig);

      expect(popup).is.instanceof(Popup);
    });

    it('should be a class constructor given no options', () => {
      expect(MediaPicker('popup')).to.equal(Popup);
    });

    it('should assign config', () => {
      const popup = MediaPicker('popup', moduleConfig, popupConfig);

      expect(popup.config).to.equal(moduleConfig);
    });

    it('should be able to register listeners to generic upload events', () => {
      const popup = MediaPicker('popup', moduleConfig, popupConfig);

      popup.on('uploads-start', payload => {});
      popup.on('upload-status-update', payload => {});
      popup.on('upload-finalize-ready', payload => {});
      popup.on('upload-preview-update', payload => {});
      popup.on('upload-processing', payload => {});
      popup.on('upload-end', payload => {});
      popup.on('upload-error', payload => {});
    });

    it('should be able to register listener to ready event', () => {
      const popup = MediaPicker('popup', moduleConfig, popupConfig);
      popup.on('ready', () => {});
    });
  });

  describe('error handling', () => {
    const sandbox = sinon.sandbox.create();

    beforeEach(() => {
      sandbox.spy(console, 'error');
    });

    afterEach(() => {
      sandbox.restore();
    });

    it('should print error to console given invalid component name', done => {
      try {
        MediaPicker(123 as any, moduleConfig);
      } catch (error) {
        expect(error.message).to.deep.equal('The component 123 does not exist');
        done();
      }
    });

    it('should print error to console given unsupported component name', done => {
      try {
        MediaPicker('dodgy' as any, moduleConfig);
      } catch (error) {
        expect(error.message).to.deep.equal(
          'The component dodgy does not exist',
        );
        done();
      }
    });
  });
});
