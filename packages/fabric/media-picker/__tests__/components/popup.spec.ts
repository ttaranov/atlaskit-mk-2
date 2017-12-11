import { expect } from 'chai';
import * as sinon from 'sinon';
import { Popup } from '../../src/components/popup';
import { MPPopupLoaded } from '../../src/outer/analytics/events';

describe('MediaPickerPopup', () => {
  const fakeContext = { trackEvent: sinon.spy() };
  const fakeModuleConfig = {
    apiUrl: 'some-api-url',
    authProvider: () => Promise.resolve({ clientId: '', token: '' }),
    uploadParams: {
      collection: '',
    },
  };
  const popupConfig = {
    userAuthProvider: () =>
      Promise.resolve({
        clientId: 'some-client-id',
        token: 'some-token',
      }),
  };

  describe('constructor', () => {
    it('fires the media picker popup loaded event ', () => {
      // tslint:disable-next-line:no-unused-expression
      new Popup(fakeContext, fakeModuleConfig, popupConfig);
      const { trackEvent } = fakeContext;

      expect(trackEvent.calledOnce).to.equal(true);
      expect(trackEvent.firstCall.args[0]).to.deep.equal(new MPPopupLoaded());
    });

    it('sets uploadParams to the default when none are supplied', () => {
      const mediaPicker = new Popup(fakeContext, fakeModuleConfig, popupConfig);

      expect((mediaPicker as any)['uploadParams']).to.deep.equal({
        collection: '',
        fetchMetadata: true,
        autoFinalize: true,
      });
    });

    it('merges uploadParams with the defaults when they are supplied', () => {
      const newUploadParams = {
        collection: 'hello-world',
        fetchMetadata: false,
        autoFinalize: false,
      };
      const moduleConfig = {
        ...fakeModuleConfig,
        uploadParams: newUploadParams,
      };
      const mediaPicker = new Popup(fakeContext, moduleConfig, popupConfig);

      expect((mediaPicker as any)['uploadParams']).to.deep.equal({
        collection: 'hello-world',
        fetchMetadata: false,
        autoFinalize: false,
      });
    });
  });

  describe('setUploadParams', () => {
    it('updates collection uploadParam when it is supplied', () => {
      const collection = 'some-collection-name';
      const newUploadParams = { collection };

      const mediaPicker = new Popup(fakeContext, fakeModuleConfig, popupConfig);
      mediaPicker.setUploadParams(newUploadParams);

      expect((mediaPicker as any)['uploadParams'].collection).to.deep.equal(
        collection,
      );
    });

    it('updates fetchMetadata uploadParam when it is supplied', () => {
      const fetchMetadata = false;
      const newUploadParams = { fetchMetadata, collection: '' };

      const mediaPicker = new Popup(fakeContext, fakeModuleConfig, popupConfig);
      mediaPicker.setUploadParams(newUploadParams);

      expect((mediaPicker as any)['uploadParams'].fetchMetadata).to.deep.equal(
        fetchMetadata,
      );
    });

    it('updates autoFinalize uploadParam when it is supplied', () => {
      const autoFinalize = false;
      const newUploadParams = { autoFinalize, collection: '' };

      const mediaPicker = new Popup(fakeContext, fakeModuleConfig, popupConfig);
      mediaPicker.setUploadParams(newUploadParams);

      expect((mediaPicker as any)['uploadParams'].autoFinalize).to.deep.equal(
        autoFinalize,
      );
    });
  });

  describe('hide', () => {
    it('fires a closed event when the popup is hidden', () => {
      const mediaPicker = new Popup(fakeContext, fakeModuleConfig, popupConfig);
      const emitSpy = sinon.spy();

      mediaPicker.emit = emitSpy;

      mediaPicker.hide();
      expect(emitSpy.calledOnce).to.equal(true);
      expect(emitSpy.args[0][0]).to.equal('closed');
    });
  });
});
