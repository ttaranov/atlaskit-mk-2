import { Action, Dispatch, Store } from 'redux';

import { Fetcher } from '../tools/fetcher/fetcher';
import {
  getFilesInRecentsFullfilled,
  getFilesInRecentsFailed,
} from '../actions';
import { State } from '../domain';
import { isGetFilesInRecentsAction } from '../actions/getFilesInRecents';
import { RECENTS_COLLECTION } from '../config';

export const getFilesInRecents = (fetcher: Fetcher) => (
  store: Store<State>,
) => (next: Dispatch<Action>) => (action: Action) => {
  if (isGetFilesInRecentsAction(action)) {
    requestRecentFiles(store);
  }

  return next(action);
};

export const requestRecentFiles = (store: Store<State>): void => {
  const { userContext } = store.getState();

  userContext.collection.getItems(RECENTS_COLLECTION).subscribe({
    next(items) {
      // This prevents showing "ghost" files in recents
      const contents = items.filter(
        item => item.details.size && item.details.size > 0,
      );
      store.dispatch(getFilesInRecentsFullfilled(contents));
    },
    error() {
      store.dispatch(getFilesInRecentsFailed());
    },
  });
};
