import { Action } from 'redux';
import { SCREEN_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { isEditorShowImageAction } from '../../actions/editorShowImage';
import { Payload } from '.';

export default (action: Action): Payload[] | undefined => {
  if (isEditorShowImageAction(action)) {
    return [
      {
        name: 'fileEditorModal',
        eventType: SCREEN_EVENT_TYPE,
      },
    ];
  }
};
