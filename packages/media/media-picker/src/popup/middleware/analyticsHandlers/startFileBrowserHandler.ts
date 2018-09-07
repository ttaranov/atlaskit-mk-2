import { SCREEN_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { Action } from 'redux';
import { Payload, buttonClickPayload } from '.';
import { isStartFileBrowserAction } from '../../actions/startFileBrowser';

export default (action: Action): Payload[] | undefined => {
  if (isStartFileBrowserAction(action)) {
    return [
      {
        name: 'localFileBrowserModal',
        eventType: SCREEN_EVENT_TYPE,
      },
      {
        ...buttonClickPayload,
        actionSubjectId: 'localFileBrowserButton',
      },
    ];
  }
};
