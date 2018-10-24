import { Action } from 'redux';

export const REMOVE_FILES_FROM_RECENTS = 'REMOVE_FILES_FROM_RECENTS';

export interface RemoveFileFromRecentsAction extends Action {
  type: 'REMOVE_FILES_FROM_RECENTS';
  id: string;
  occurrenceKey?: string;
}

export const isRemoveFileFromRecentsAction = (
  action: Action,
): action is RemoveFileFromRecentsAction => {
  return action.type === REMOVE_FILES_FROM_RECENTS;
};

export const removeFileFromRecents = (
  id: string,
  occurrenceKey?: string,
): RemoveFileFromRecentsAction => {
  return {
    type: REMOVE_FILES_FROM_RECENTS,
    id,
    occurrenceKey,
  };
};
