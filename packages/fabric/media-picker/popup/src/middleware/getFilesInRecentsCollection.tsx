import { AuthProvider } from '@atlaskit/media-core';
import { Action, Dispatch, Store } from 'redux';

import { Fetcher } from '../tools/fetcher/fetcher';
import { updateRecentFiles } from '../actions';
import { State } from '../domain';
import {
  GET_FILES_IN_RECENTS_COLLECTION,
  GetFilesInRecentsCollectionAction,
} from '../actions/getFilesInRecentsCollection';

const isGetFilesInRecentsCollectionAction = (
  action: Action,
): action is GetFilesInRecentsCollectionAction => {
  return action.type === GET_FILES_IN_RECENTS_COLLECTION;
};

export const getFilesInRecentsCollection = (
  fetcher: Fetcher,
  userAuthProvider: AuthProvider,
) => (store: Store<State>) => (next: Dispatch<Action>) => (action: Action) => {
  if (isGetFilesInRecentsCollectionAction(action)) {
    // const { apiUrl } = store.getState();
    // userAuthProvider()
    //   .then(auth => fetcher.getRecentFiles(apiUrl, auth, 30, 'desc'))
    //   .then(({ contents, nextInclusiveStartKey }) =>
    //     store.dispatch(updateRecentFiles(contents, nextInclusiveStartKey)),
    //   );
  }

  return next(action);
};
