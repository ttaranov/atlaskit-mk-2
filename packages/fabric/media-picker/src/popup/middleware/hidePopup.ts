import { Action, Store, Dispatch } from 'redux';
import { isHidePopupAction } from '../actions/hidePopup';
import { State } from '../domain';
import { ParentChannel } from '../interactors/parentChannel';

export const hidePopup = (parentChannel: ParentChannel) => (
  store: Store<State>,
) => (next: Dispatch<State>) => (action: Action) => {
  if (isHidePopupAction(action)) {
    parentChannel.hidePopup();
  }
  return next(action);
};
