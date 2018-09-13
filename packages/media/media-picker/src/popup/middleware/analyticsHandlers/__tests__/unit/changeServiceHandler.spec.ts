import changeServiceHandler from '../../changeServiceHandler';
import { changeService } from '../../../../actions/changeService';
import { createVerificationForHandler } from './utils';
import { buttonClickPayload } from '../..';
import { ServiceName } from '../../../../domain';
import { SCREEN_EVENT_TYPE } from '@atlaskit/analytics-gas-types';

const GOOGLE: ServiceName = 'google';
const DROPBOX: ServiceName = 'dropbox';
const GIPHY: ServiceName = 'giphy';
const UPLOAD: ServiceName = 'upload';

const verifyFor = createVerificationForHandler(changeServiceHandler);

describe('changeServiceHandler', () => {
  it('should return two payloads for upload service ', () => {
    verifyFor(changeService(UPLOAD), [
      {
        ...buttonClickPayload,
        actionSubjectId: 'uploadButton',
      },
      {
        name: 'recentFilesBrowserModal',
        eventType: SCREEN_EVENT_TYPE,
      },
    ]);
  });

  it('should return a payload for google service', () => {
    verifyFor(changeService(GOOGLE), [
      {
        ...buttonClickPayload,
        actionSubjectId: 'cloudBrowserButton',
        attributes: {
          cloudType: GOOGLE,
        },
      },
    ]);
  });

  it('should return a payload for dropbox service', () => {
    verifyFor(changeService(DROPBOX), [
      {
        ...buttonClickPayload,
        actionSubjectId: 'cloudBrowserButton',
        attributes: {
          cloudType: DROPBOX,
        },
      },
    ]);
  });

  it('should return a payload for giphyGIPHY service', () => {
    verifyFor(changeService(GIPHY), [
      {
        ...buttonClickPayload,
        actionSubjectId: 'cloudBrowserButton',
        attributes: {
          cloudType: GIPHY,
        },
      },
    ]);
  });
});
