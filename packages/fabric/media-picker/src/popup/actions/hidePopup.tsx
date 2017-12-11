import { Action } from 'redux';

export interface HidePopupAction extends Action {
  readonly type: 'HIDE_POPUP';
}

export function isHidePopupAction(action: Action): action is HidePopupAction {
  return action.type === 'HIDE_POPUP';
}

export function hidePopup(): HidePopupAction {
  return {
    type: 'HIDE_POPUP',
  };
}
