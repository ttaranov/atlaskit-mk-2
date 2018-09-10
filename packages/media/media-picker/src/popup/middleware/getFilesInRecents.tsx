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
      // TODO: ghost files handling
      // This prevents showing "ghost" files in recents
      // contents: data.contents.filter(
      //   item => item.details.size && item.details.size > 0,
      // ),
      store.dispatch(
        // TODO: we can remove the nextKey completelly
        getFilesInRecentsFullfilled(items, ''),
      );
    },
    error() {
      store.dispatch(getFilesInRecentsFailed());
    },
  });
};
