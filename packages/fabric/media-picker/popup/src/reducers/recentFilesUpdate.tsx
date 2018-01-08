import { UPDATE_RECENT_FILES, UpdateRecentFilesAction } from '../actions';
import { State } from '../domain';

export default function recentFilesUpdate(
  state: State,
  action: UpdateRecentFilesAction,
): State {
  if (action.type === UPDATE_RECENT_FILES) {
    const { items, nextKey } = action;
    return {
      ...state,
      recents: {
        items,
        nextKey,
      },
    };
  } else {
    return state;
  }
}
