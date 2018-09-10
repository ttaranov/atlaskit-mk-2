import { Action } from 'redux';
import { isFileListUpdateAction } from '../../actions/fileListUpdate';
import { SCREEN_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { Payload } from '.';

export default (action: Action): Payload[] | undefined => {
  if (isFileListUpdateAction(action)) {
    return [
      {
        name: 'cloudBrowserModal',
        eventType: SCREEN_EVENT_TYPE,
        attributes: {
          cloudType: action.serviceName,
        },
      },
    ];
  }

  return undefined;
};
