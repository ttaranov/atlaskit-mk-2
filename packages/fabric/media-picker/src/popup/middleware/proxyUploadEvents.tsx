import { Store, Dispatch, Action } from 'redux';

import { UploadEvent } from '../../domain/uploadEvent';
import { uploadHasProxy } from '../tools/uploadHasProxy';
import { ParentChannel } from '../interactors/parentChannel';
import { finalizeUpload } from '../actions/finalizeUpload';
import { State } from '../domain';
import { RECENTS_COLLECTION } from '../config';
import { MediaFile } from '../../domain/file';

export interface ProxyUploadEventsAction extends Action {
  readonly file: MediaFile;
  readonly originalEvent: UploadEvent;
}

export const proxyUploadEvents = (parentChannel: ParentChannel) => (
  store: Store<State>,
) => (next: Dispatch<State>) => (action: ProxyUploadEventsAction) => {
  if (
    [
      'FILE_PREVIEW_UPDATE',
      'FILE_UPLOAD_PROGRESS',
      'FILE_UPLOAD_PROCESSING_START',
      'FILE_UPLOAD_END',
      'FILE_UPLOAD_ERROR',
    ].indexOf(action.type) > -1
  ) {
    const { uploads } = store.getState();
    const { file, originalEvent } = action;

    if (file) {
      const upload = uploads[file.id];

      if (upload && upload.proxy && uploadHasProxy(upload)) {
        const event = { ...originalEvent };
        const { tenant } = upload;

        upload.proxy.forEach(uploadId => {
          if (event.name === 'upload-processing') {
            const { file: localFile } = event.data;
            const source = {
              id: localFile.publicId!,
              collection: RECENTS_COLLECTION,
            };

            store.dispatch(finalizeUpload(localFile, uploadId, source, tenant));
          } else if (event.name !== 'upload-end') {
            parentChannel.sendUploadEvent(event, uploadId);
          }
        });
      }
    }
  }

  return next(action);
};
