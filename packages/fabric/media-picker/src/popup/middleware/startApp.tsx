import { Action, Store, Dispatch } from 'redux';

import { isStartAppAction } from '../actions/startApp';
import { updatePopupUrls } from '../actions/updatePopupUrls';
import { getFilesInRecentsCollection } from '../actions/getFilesInRecentsCollection';
import { getConnectedRemoteAccounts } from '../actions/getConnectedRemoteAccounts';

import { State } from '../domain';

import { ModuleConfig } from '../../domain/config';

import { ParentChannel } from '../interactors/parentChannel';

export type SetConfig = (config: ModuleConfig) => void;

export default (parentChannel: ParentChannel) => (store: Store<State>) => (
  next: Dispatch<Action>,
) => (action: Action) => {
  if (isStartAppAction(action)) {
    const { apiUrl, redirectUrl } = store.getState();

    store.dispatch(updatePopupUrls({ apiUrl, redirectUrl }));
    store.dispatch(getConnectedRemoteAccounts());
    store.dispatch(getFilesInRecentsCollection());

    parentChannel.ready();
  }
  return next(action);
};
