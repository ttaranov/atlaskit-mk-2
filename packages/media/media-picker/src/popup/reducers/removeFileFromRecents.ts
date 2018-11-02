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
    // TODO this action.id is recents one, but item.id is tenant one.
    const selectedItems = state.selectedItems.filter(
      item => item.id !== action.id,
    );

    const uploadIdsToDelete = Object.keys(state.uploads).filter(
      uploadId => state.uploads[uploadId].file.metadata.id === action.id,
    );
    const uploads = { ...state.uploads };
    uploadIdsToDelete.forEach(uploadId => {
      delete uploads[uploadId];
    });

    return {
      ...state,
      recents: { items: recentItems },
      selectedItems,
      uploads,
    };
  } else {
    return state;
  }
}
