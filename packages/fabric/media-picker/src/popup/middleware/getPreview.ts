import { Store, Dispatch } from 'redux';

import { Fetcher } from '../tools/fetcher/fetcher';
import { GetPreviewAction, GET_PREVIEW } from '../actions/getPreview';
import { ParentChannel } from '../interactors/parentChannel';
import { State } from '../domain';

import { AuthService } from '../services/auth-service';

export const getPreview = (
  fetcher: Fetcher,
  authService: AuthService,
  parentChannel: ParentChannel,
) => (store: Store<State>) => (next: Dispatch<State>) => (
  action: GetPreviewAction,
) => {
  if (action.type === GET_PREVIEW) {
    const { apiUrl } = store.getState();
    const { uploadId, file, collection } = action;

    authService
      .getUserAuth()
      .then(auth => fetcher.getImagePreview(apiUrl, auth, file.id, collection))
      .then(imagePreview => {
        parentChannel.sendUploadEvent(
          {
            name: 'upload-preview-update',
            data: {
              file,
              preview: imagePreview,
            },
          },
          uploadId,
        );
      });
  }

  return next(action);
};
