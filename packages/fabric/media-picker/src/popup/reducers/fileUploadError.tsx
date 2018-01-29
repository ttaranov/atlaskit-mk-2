import { Action } from 'redux';
import { State } from '../domain';
import { isFileUploadErrorAction, isDismissFileUploadErrorAction } from '../actions/fileUploadError';

export default function(state: State, action: Action): State {
  if (isFileUploadErrorAction(action)) {
    return {
      ...state,
      view: {
        ...state.view,
        error: {
          type: action.type
        },
      },
    };
  } else if (isDismissFileUploadErrorAction(action)) {
      return {
        ...state,
        view: {
          ...state.view,
          error: undefined,
        }
      }
  } else {
    return state;
  }
}
