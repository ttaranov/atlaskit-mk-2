import { Action } from 'redux';
import { isEditRemoteImageAction } from '../../actions/editRemoteImage';
import { Payload, buttonClickPayload } from '.';

export default (action: Action): Payload[] | undefined => {
  if (isEditRemoteImageAction(action)) {
    return [
      {
        ...buttonClickPayload,
        actionSubjectId: 'annotateFileButton',
      },
    ];
  }

  return undefined;
};
