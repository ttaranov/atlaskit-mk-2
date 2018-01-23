import { Action } from 'redux';

export const EDITOR_CLOSE = 'EDITOR_CLOSE';

export function isEditorCloseAction(action: Action) {
  return action.type === EDITOR_CLOSE;
}

export function editorClose(): Action {
  return {
    type: EDITOR_CLOSE,
  };
}
