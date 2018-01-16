import { Action, Store, Dispatch } from 'redux';
import { isHidePopupAction } from '../actions/hidePopup';
import { State } from '../domain';
import { PopupUploadEventEmitter } from '../../components/popup';

export default (eventEmitter: PopupUploadEventEmitter) => (
  store: Store<State>,
) => (next: Dispatch<State>) => (action: Action) => {
  if (isHidePopupAction(action)) {
    eventEmitter.emitClosed();
  }
  return next(action);
};
