import { Dispatch, MiddlewareAPI, Action } from 'redux';

import { isStartAppAction } from '../actions/startApp';
import { updatePopupUrls } from '../actions/updatePopupUrls';

import { State } from '../domain';
import { ModuleConfig } from '../../domain/config';

import { PopupUploadEventEmitter } from '../../components/popup';

export type SetConfig = (config: ModuleConfig) => void;

export default function(eventEmitter: PopupUploadEventEmitter) {
  return (store: MiddlewareAPI<State>) => (next: Dispatch<State>) => (
    action: Action,
  ) => {
    if (isStartAppAction(action)) {
      const { apiUrl, redirectUrl } = store.getState();
      store.dispatch(updatePopupUrls({ apiUrl, redirectUrl }));
    }
    return next(action);
  };
}
