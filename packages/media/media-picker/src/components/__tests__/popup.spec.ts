import { Popup, PopupConfig } from '../popup';
import { MPPopupLoaded } from '../../outer/analytics/events';
import { UploadParams } from '../..';
import { ContextFactory } from '@atlaskit/media-core';

describe('MediaPickerPopup', () => {
  const fakeContext = { trackEvent: jest.fn() };
  const context = ContextFactory.create({
    serviceHost: 'some-api-url',
    authProvider: () => Promise.resolve({ clientId: '', token: '' }),
    userAuthProvider: () =>
      Promise.resolve({
        clientId: 'some-client-id',
        token: 'some-token',
      }),
  });
  const popupConfig: PopupConfig = {
    uploadParams: {
      collection: '',
    },
  };

  describe('constructor', () => {
    it('fires the media picker popup loaded event ', () => {
      // tslint:disable-next-line:no-unused-expression
      new Popup(fakeContext, context, popupConfig);
      const { trackEvent } = fakeContext;

      expect(trackEvent).toHaveBeenCalled();
      expect(trackEvent.mock.calls[0][0]).toEqual(new MPPopupLoaded());
    });

    it('sets uploadParams to the default when none are supplied', () => {
      const mediaPicker = new Popup(fakeContext, context, popupConfig);

      const expectedUploadParams: UploadParams = {
        collection: '',
      };
      expect((mediaPicker as any)['uploadParams'] as UploadParams).toEqual(
        expectedUploadParams,
      );
    });

    it('merges uploadParams with the defaults when they are supplied', () => {
      const newUploadParams: UploadParams = {
        collection: 'hello-world',
      };
      const mediaPicker = new Popup(fakeContext, context, {
        ...popupConfig,
        uploadParams: newUploadParams,
      });

      expect((mediaPicker as any)['uploadParams'] as UploadParams).toEqual({
        collection: 'hello-world',
      });
    });
  });

  describe('setUploadParams', () => {
    it('updates collection uploadParam when it is supplied', () => {
      const collection = 'some-collection-name';
      const newUploadParams: UploadParams = { collection };

      const mediaPicker = new Popup(fakeContext, context, popupConfig);
      mediaPicker.setUploadParams(newUploadParams);

      expect(
        ((mediaPicker as any)['uploadParams'] as UploadParams).collection,
      ).toEqual(collection);
    });
  });

  describe('hide', () => {
    it('fires a closed event when the popup is hidden', () => {
      const mediaPicker = new Popup(fakeContext, context, popupConfig);
      const emitSpy = jest.fn();

      mediaPicker.emit = emitSpy;

      mediaPicker.hide();
      expect(emitSpy).toHaveBeenCalled();
      expect(emitSpy.mock.calls[0][0]).toEqual('closed');
    });
  });

  describe('cancel', () => {
    it('should blow up with empty argument', () => {
      const mediaPicker = new Popup(fakeContext, context, popupConfig);
      expect(() => mediaPicker.cancel()).toThrow();
    });
  });
});
