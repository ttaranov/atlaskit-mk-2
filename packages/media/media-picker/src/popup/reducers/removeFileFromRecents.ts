import { Action } from 'redux';

import { isRemoveFileFromRecentsAction } from '../actions/removeFileFromRecents';
import { State } from '../domain';

export default function removeFileFromRecents(
  state: State,
  action: Action,
): State {
  if (isRemoveFileFromRecentsAction(action)) {
    const recentItems = state.recents.items.filter(
      item => item.id !== action.id,
    );
    return { ...state, recents: { items: recentItems } };
  } else {
    return state;
  }
}
