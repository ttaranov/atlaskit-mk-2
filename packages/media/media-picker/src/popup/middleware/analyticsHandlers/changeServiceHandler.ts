import { Action } from 'redux';
import { isChangeServiceAction } from '../../actions/changeService';
import { Payload, buttonClickPayload } from '.';
import { SCREEN_EVENT_TYPE } from '@atlaskit/analytics-gas-types';

export default (action: Action): Payload[] | undefined => {
  if (isChangeServiceAction(action)) {
    if (action.serviceName === 'upload') {
      return [
        {
          ...buttonClickPayload,
          actionSubjectId: 'uploadButton',
        },
        {
          name: 'recentFilesBrowserModal',
          eventType: SCREEN_EVENT_TYPE,
        },
      ];
    } else {
      return [
        {
          ...buttonClickPayload,
          actionSubjectId: 'cloudBrowserButton',
          attributes: {
            cloudType: action.serviceName,
          },
        },
      ];
    }
  }
};
