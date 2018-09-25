import { Store, Dispatch } from 'redux';

import { fileToBase64 } from '../tools/fileToBase64';
import { Fetcher } from '../tools/fetcher/fetcher';
import { couldNotLoadImage } from '../components/views/editor/phrases';
import { editorShowError } from '../actions/editorShowError';
import { editorShowImage } from '../actions/editorShowImage';
import { editorShowLoading } from '../actions/editorShowLoading';
import {
  EDIT_REMOTE_IMAGE,
  EditRemoteImageAction,
} from '../actions/editRemoteImage';
import { State } from '../domain';

// When we complete upload, we need to check if we can open the editor.
// What can be changed:
// 1) The user pressed ESC and the editor shouldn't appear. In this case state.editorData will be null.
// 2) The user has chosen another image to edit. In this case state.editorData.originalFile.id will be different.
//
// We continue with the uploaded image only if:
// - the file is the same
// - state.imageUrl is not defined (the editor is not open)
const continueRenderingEditor = (id: string, store: Store<State>): boolean => {
  const { editorData } = store.getState();
  if (!editorData) {
    return false;
  }

  const { originalFile, imageUrl } = editorData;
  if (originalFile) {
    return originalFile.id === id && !imageUrl;
  } else {
    return false;
  }
};

export const editRemoteImageMiddleware = (fetcher: Fetcher) => (
  store: Store<State>,
) => (next: Dispatch<State>) => (action: EditRemoteImageAction) => {
  if (action.type === EDIT_REMOTE_IMAGE) {
    editRemoteImage(fetcher, store, action);
  }

  return next(action);
};

export function editRemoteImage(
  fetcher: Fetcher,
  store: Store<State>,
  action: EditRemoteImageAction,
): Promise<void> {
  const { item, collectionName } = action;
  const { userContext } = store.getState();

  store.dispatch(editorShowLoading(item));

  return userContext.config
    .authProvider()
    .then(auth => fetcher.getImage(auth, item.id, collectionName))
    .then(fileToBase64)
    .then(base64image => {
      if (continueRenderingEditor(item.id, store)) {
        store.dispatch(editorShowImage(base64image));
      }
    })
    .catch(() => {
      if (continueRenderingEditor(item.id, store)) {
        const retryHandler = () => {
          store.dispatch(action);
        };
        store.dispatch(editorShowError(couldNotLoadImage, retryHandler));
      }
    });
}
