import { Store, Dispatch, Middleware } from 'redux';

import { Fetcher } from '../tools/fetcher/fetcher';
import { GetPreviewAction, isGetPreviewAction } from '../actions/getPreview';
import { State } from '../domain';
import {
  sendUploadEvent,
  SendUploadEventAction,
} from '../actions/sendUploadEvent';
import { AuthService } from '../../domain/auth';

export default function(
  fetcher: Fetcher,
  authService: AuthService,
): Middleware {
  return store => (next: Dispatch<State>) => action => {
    if (isGetPreviewAction(action)) {
      getPreview(fetcher, authService, store as any, action);
    }
    return next(action);
  };
}

export function getPreview(
  fetcher: Fetcher,
  authService: AuthService,
  store: Store<State>,
  { uploadId, file, collection }: GetPreviewAction,
): Promise<SendUploadEventAction> {
  const { apiUrl } = store.getState();

  return authService
    .getUserAuth()
    .then(auth => fetcher.getPreview(apiUrl, auth, file.id, collection))
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
