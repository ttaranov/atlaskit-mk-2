import { Action, MiddlewareAPI } from 'redux';
import { State } from '../../domain';
import { isEditorCloseAction } from '../../actions/editorClose';
import { Payload, buttonClickPayload } from '.';

export default (
  action: Action,
  store: MiddlewareAPI<State>,
): Payload[] | undefined => {
  if (isEditorCloseAction(action)) {
    return [
      {
        ...buttonClickPayload,
        actionSubjectId: `mediaEditor${action.selection}Button`,
      },
    ];
  }
};
