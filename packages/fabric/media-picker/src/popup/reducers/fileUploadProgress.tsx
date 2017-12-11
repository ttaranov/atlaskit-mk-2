import { Action } from 'redux';

import { isFileUploadProgressAction } from '../actions/fileUploadProgress';
import { State } from '../domain';

export default function fileUploadProgress(
  state: State,
  action: Action,
): State {
  if (isFileUploadProgressAction(action)) {
    const uploads = Object.assign({}, state.uploads);
    if (uploads[action.file.id]) {
      uploads[action.file.id].progress = action.progress;
      uploads[action.file.id].events.push(action.originalEvent);
    }
    return Object.assign({}, state, { uploads });
  } else {
    return state;
  }
}
