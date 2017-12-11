import { Action } from 'redux';

import { isChangeCloudAccountFolderAction } from '../actions';
import { State } from '../domain';

export default function pathChangeRequest(state: State, action: Action): State {
  if (isChangeCloudAccountFolderAction(action)) {
    const view = Object.assign({}, state.view, {
      loading: true,
      path: action.path,
      currentCursor: undefined,
      nextCursor: undefined,
    });
    return Object.assign({}, state, { view });
  } else {
    return state;
  }
}
