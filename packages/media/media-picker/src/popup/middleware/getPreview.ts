import { Store, Dispatch, Middleware } from 'redux';

import { Fetcher } from '../tools/fetcher/fetcher';
import { GetPreviewAction, isGetPreviewAction } from '../actions/getPreview';
import { State } from '../domain';
import {
  sendUploadEvent,
  SendUploadEventAction,
} from '../actions/sendUploadEvent';

export default function(fetcher: Fetcher): Middleware {
  return store => (next: Dispatch<State>) => action => {
    if (isGetPreviewAction(action)) {
      getPreview(fetcher, store as any, action);
    }
    return next(action);
  };
}

export function getPreview(
  fetcher: Fetcher,
  store: Store<State>,
  { uploadId, file, collection }: GetPreviewAction,
): Promise<SendUploadEventAction> {
  const { userAuthProvider } = store.getState();

  return userAuthProvider()
    .then(auth => fetcher.getPreview(auth, file.id, collection))
    .then(preview =>
      store.dispatch(
        sendUploadEvent({
          event: {
            name: 'upload-preview-update',
            data: {
              file,
              preview,
            },
          },
          uploadId,
        }),
      ),
    );
}
