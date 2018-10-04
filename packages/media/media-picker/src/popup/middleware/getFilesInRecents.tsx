import { Action, Dispatch, Store } from 'redux';
import {
  getFilesInRecentsFullfilled,
  getFilesInRecentsFailed,
  saveCollectionItemsSubscription,
} from '../actions';
import { State } from '../domain';
import { isGetFilesInRecentsAction } from '../actions/getFilesInRecents';
import { RECENTS_COLLECTION } from '../config';

export const getFilesInRecents = () => (store: Store<State>) => (
  next: Dispatch<Action>,
) => (action: Action) => {
  if (isGetFilesInRecentsAction(action)) {
    requestRecentFiles(store);
  }

  return next(action);
};

export const requestRecentFiles = (store: Store<State>): void => {
  const { userContext, collectionItemsSubscription } = store.getState();

  if (collectionItemsSubscription) {
    collectionItemsSubscription.unsubscribe();
  }

  const subscription = userContext.collection
    .getItems(RECENTS_COLLECTION)
    .subscribe({
      next(items) {
        // TODO: Move this logic into CollectionFetcher
        // [TODO] MS-705: remove after backend adds filter
        // This prevents showing "ghost" files in recents
        const contents = items.filter(
          item => item.details.size && item.details.size > 0,
        );
        console.log('getItems', items.length, contents.length);
        store.dispatch(getFilesInRecentsFullfilled(contents));
      },
      error() {
        store.dispatch(getFilesInRecentsFailed());
      },
    });

  store.dispatch(saveCollectionItemsSubscription(subscription));
};
