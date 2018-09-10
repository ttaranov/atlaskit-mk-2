import { SCREEN_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { Action } from 'redux';
import { Payload } from '.';
import { isShowPopupAction } from '../../actions/showPopup';

export default (action: Action): Payload[] | undefined => {
  if (isShowPopupAction(action)) {
    return [
      {
        name: 'mediaPickerModal',
        eventType: SCREEN_EVENT_TYPE,
      },
      {
        name: 'recentFilesBrowserModal',
        eventType: SCREEN_EVENT_TYPE,
      },
    ];
  }

  return undefined;
};
