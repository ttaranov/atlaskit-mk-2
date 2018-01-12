import * as uuid from 'uuid';
import { Store, Dispatch, Middleware } from 'redux';

import { State, Tenant, SelectedItem, LocalUpload } from '../domain';

import { isStartImportAction } from '../actions/startImport';
import { finalizeUpload } from '../actions/finalizeUpload';
import { remoteUploadStart } from '../actions/remoteUploadStart';
import { getPreview } from '../actions/getPreview';
import { handleCloudFetchingEvent } from '../actions/handleCloudFetchingEvent';
import { setEventProxy } from '../actions/setEventProxy';
import { hidePopup } from '../actions/hidePopup';

import { RECENTS_COLLECTION } from '../config';

import { WsProvider } from '../tools/websocket/wsProvider';
import { WsConnectionHolder } from '../tools/websocket/wsConnectionHolder';
import { RemoteUploadActivity } from '../tools/websocket/upload/remoteUploadActivity';
import { MediaFile, copyMediaFileForUpload } from '../../../src/domain/file';
import { PopupUploadEventEmitter } from '../../../src/components/popup';
import { sendUploadEvent } from '../actions/sendUploadEvent';
import { AuthService } from '../../../src/domain/auth';

export interface RemoteFileItem extends SelectedItem {
  accountId: string;
  publicId: string;
}

export const isRemoteFileItem = (
  item: SelectedItem,
): item is RemoteFileItem => {
  return ['dropbox', 'google'].indexOf(item.serviceName) !== -1;
};

export const isRemoteService = (serviceName: string) => {
  return ['dropbox', 'google'].indexOf(serviceName) !== -1;
};

type SelectedUploadFile = {
  readonly file: MediaFile;
  readonly uploadId: string;
  readonly serviceName: string;
  readonly accountId?: string;
};

const mapSelectedItemToSelectedUploadFile = ({
  id,
  name,
  mimeType,
  size,
  date,
  serviceName,
  accountId,
}: SelectedItem): SelectedUploadFile => ({
  file: {
    id,
    name,
    size,
    creationDate: date || Date.now(),
    type: mimeType,
  },
  serviceName,
  accountId,
  uploadId: uuid.v4(),
});

export function importFilesMiddleware(
  eventEmitter: PopupUploadEventEmitter,
  authService: AuthService,
  wsProvider: WsProvider,
): Middleware {
  return store => (next: Dispatch<State>) => action => {
    if (isStartImportAction(action)) {
      importFiles(eventEmitter, store as any, authService, wsProvider);
    }
    return next(action);
  };
}

export function importFiles(
  eventEmitter: PopupUploadEventEmitter,
  store: Store<State>,
  authService: AuthService,
  wsProvider: WsProvider,
): Promise<void> {
  const { apiUrl, uploads, tenant, selectedItems } = store.getState();

  store.dispatch(hidePopup());

  return authService.getUserAuth().then(auth => {
    const selectedUploadFiles = selectedItems.map(
      mapSelectedItemToSelectedUploadFile,
    );

    eventEmitter.emitUploadsStart(
      selectedUploadFiles.map(({ file, uploadId }) =>
        copyMediaFileForUpload(file, uploadId),
      ),
    );

    selectedUploadFiles.forEach(selectedUploadFile => {
      const { file, serviceName, uploadId } = selectedUploadFile;
      const selectedItemId = file.id;
      if (serviceName === 'upload') {
        const localUpload: LocalUpload = uploads[selectedItemId];
        importFilesFromLocalUpload(
          selectedItemId,
          tenant,
          uploadId,
          store,
          localUpload,
        );
      } else if (serviceName === 'recent_files') {
        importFilesFromRecentFiles(selectedUploadFile, tenant, store);
      } else if (isRemoteService(serviceName)) {
        const wsConnectionHolder = wsProvider.getWsConnectionHolder(
          apiUrl,
          auth,
        );
        importFilesFromRemoteService(
          selectedUploadFile,
          tenant,
          store,
          wsConnectionHolder,
        );
      }
    });
  });
}

export const importFilesFromLocalUpload = (
  selectedItemId: string,
  tenant: Tenant,
  uploadId: string,
  store: Store<State>,
  localUpload: LocalUpload,
): void => {
  localUpload.events.forEach(originalEvent => {
    const event = { ...originalEvent };

    if (event.name === 'upload-processing') {
      const { file } = event.data;
      const source = {
        id: file.publicId,
        collection: RECENTS_COLLECTION,
      };

      store.dispatch(finalizeUpload(file, uploadId, source, tenant));
    } else if (event.name !== 'upload-end') {
      store.dispatch(sendUploadEvent({ event, uploadId }));
    }
  });

  store.dispatch(setEventProxy(selectedItemId, uploadId));
};

export const importFilesFromRecentFiles = (
  selectedUploadFile: SelectedUploadFile,
  tenant: Tenant,
  store: Store<State>,
): void => {
  const { file, uploadId } = selectedUploadFile;
  const source = {
    id: file.id,
    collection: RECENTS_COLLECTION,
  };

  store.dispatch(finalizeUpload(file, uploadId, source, tenant));
  store.dispatch(getPreview(uploadId, file, RECENTS_COLLECTION));
};

export const importFilesFromRemoteService = (
  selectedUploadFile: SelectedUploadFile,
  tenant: Tenant,
  store: Store<State>,
  wsConnectionHolder: WsConnectionHolder,
): void => {
  const { uploadId, serviceName, accountId, file } = selectedUploadFile;
  const uploadActivity = new RemoteUploadActivity(
    uploadId,
    (event, payload) => {
      store.dispatch(handleCloudFetchingEvent(file, event, payload));
    },
  );
  wsConnectionHolder.openConnection(uploadActivity);

  uploadActivity.on('Started', () => {
    store.dispatch(remoteUploadStart(uploadId, tenant));
  });

  wsConnectionHolder.send({
    type: 'fetchFile',
    params: {
      serviceName: serviceName,
      accountId: accountId,
      fileId: file.id,
      fileName: file.name,
      collection: RECENTS_COLLECTION,
      jobId: uploadId,
    },
  });
};
