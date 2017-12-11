import * as uuid from 'uuid';
import { Store, Dispatch, Action } from 'redux';

import { State, Tenant, SelectedItem, LocalUpload } from '../domain';

import { AuthService } from '../services/auth-service';
import { isStartImportAction } from '../actions/startImport';
import { finalizeUpload } from '../actions/finalizeUpload';
import { remoteUploadStart } from '../actions/remoteUploadStart';
import { getPreview } from '../actions/getPreview';
import { handleCloudFetchingEvent } from '../actions/handleCloudFetchingEvent';
import { setEventProxy } from '../actions/setEventProxy';
import { hidePopup } from '../actions/hidePopup';

import { RECENTS_COLLECTION } from '../config';
import { ParentChannel } from '../interactors/parentChannel';

import { WsProvider } from '../tools/websocket/wsProvider';
import { WsConnectionHolder } from '../tools/websocket/wsConnectionHolder';
import { RemoteUploadActivity } from '../tools/websocket/upload/remoteUploadActivity';
import { SelectedUploadFile, UploadEvent } from '../../domain/uploadEvent';

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

export const importFilesMiddleware = (
  authService: AuthService,
  parentChannel: ParentChannel,
  wsProvider: WsProvider,
) => (store: Store<State>) => (next: Dispatch<State>) => (action: Action) => {
  if (isStartImportAction(action)) {
    importFiles(store, authService, parentChannel, wsProvider);
  }
  return next(action);
};

export function importFiles(
  store: Store<State>,
  authService: AuthService,
  parentChannel: ParentChannel,
  wsProvider: WsProvider,
): Promise<void> {
  const { apiUrl, uploads, tenant, selectedItems } = store.getState();

  store.dispatch(hidePopup());

  return authService.getUserAuth().then(auth => {
    const selectedUploadFiles = selectedItems.map(
      mapSelectedItemToSelectedUploadFile,
    );

    parentChannel.sendUploadsStartEvent(selectedUploadFiles);

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
          parentChannel,
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
  parentChannel: ParentChannel,
): void => {
  localUpload.events.forEach(originalEvent => {
    const event: UploadEvent = { ...originalEvent };

    if (event.name === 'upload-processing') {
      const { file } = event.data;
      const source = {
        id: file.publicId!,
        collection: RECENTS_COLLECTION,
      };

      store.dispatch(finalizeUpload(file, uploadId, source, tenant));
    } else if (event.name !== 'upload-end') {
      parentChannel.sendUploadEvent(event, uploadId);
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
