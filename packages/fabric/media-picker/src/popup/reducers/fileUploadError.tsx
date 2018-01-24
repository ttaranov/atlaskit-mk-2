import { Action } from 'redux';
import { State } from '../domain';
import { isFileUploadErrorAction } from '../actions/fileUploadError';

export default function(state: State, action: Action): State {
  if (isFileUploadErrorAction(action)) {
    return {
      ...state,
      view: {
        ...state.view,
        hasError: true,
      },
    };
  } else {
    return state;
  }
}
