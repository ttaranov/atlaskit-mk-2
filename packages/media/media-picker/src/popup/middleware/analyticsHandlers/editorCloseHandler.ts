import { Action } from 'redux';
import { isEditorCloseAction } from '../../actions/editorClose';
import { Payload, buttonClickPayload } from '.';

export default (action: Action): Payload[] | undefined => {
  if (isEditorCloseAction(action)) {
    return [
      {
        ...buttonClickPayload,
        actionSubjectId: `mediaEditor${action.selection}Button`,
      },
    ];
  }

  return undefined;
};
