import { Action, Dispatch, Store } from 'redux';
import { Subscription } from 'rxjs/Subscription';
import {
  getFilesInRecentsFullfilled,
  getFilesInRecentsFailed,
} from '../actions';
import { State } from '../domain';
import { isGetFilesInRecentsAction } from '../actions/getFilesInRecents';
import { RECENTS_COLLECTION } from '../config';

let subscription: Subscription | undefined;

export const getFilesInRecents = () => (store: Store<State>) => (
  next: Dispatch<Action>,
) => (action: Action) => {
  if (isGetFilesInRecentsAction(action)) {
    requestRecentFiles(store);
  }

  return next(action);
};

export const requestRecentFiles = (store: Store<State>): void => {
  const { userContext } = store.getState();

  if (subscription) {
    subscription.unsubscribe();
  }

  subscription = userContext.collection.getItems(RECENTS_COLLECTION).subscribe({
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
