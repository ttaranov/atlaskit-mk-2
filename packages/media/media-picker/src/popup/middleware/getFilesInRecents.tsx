import { AuthProvider } from '@atlaskit/media-core';
import { Action, Dispatch, Store } from 'redux';

import { Fetcher } from '../tools/fetcher/fetcher';
import {
  getFilesInRecentsFullfilled,
  getFilesInRecentsFailed,
} from '../actions';
import { State } from '../domain';
import { isGetFilesInRecentsAction } from '../actions/getFilesInRecents';

export const getFilesInRecents = (fetcher: Fetcher) => (
  store: Store<State>,
) => (next: Dispatch<Action>) => (action: Action) => {
  const { userAuthProvider } = store.getState();
  if (isGetFilesInRecentsAction(action)) {
    requestRecentFiles(fetcher, userAuthProvider, store);
  }

  return next(action);
};

export const requestRecentFiles = (
  fetcher: Fetcher,
  userAuthProvider: AuthProvider,
  store: Store<State>,
): Promise<void> => {
  const { context } = store.getState();

  return new Promise((resolve, reject) => {
    context.collection.getUserRecentItems().subscribe({
      next(ids) {
        console.log({ ids });
        const nextInclusiveStartKey = 'key';
        store.dispatch(getFilesInRecentsFullfilled(ids, nextInclusiveStartKey));
        resolve();
      },
      error() {
        store.dispatch(getFilesInRecentsFailed());
        // reject();
      },
    });
  });
};
