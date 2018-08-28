import { Store, Dispatch, Middleware } from 'redux';

import { Fetcher } from '../tools/fetcher/fetcher';
import {
  FinalizeUploadAction,
  isFinalizeUploadAction,
} from '../actions/finalizeUpload';
import { State, Tenant, SourceFile } from '../domain';
import { mapAuthToSourceFileOwner } from '../domain/source-file';
import { MediaFile } from '../../domain/file';
import {
  sendUploadEvent,
  SendUploadEventAction,
} from '../actions/sendUploadEvent';

export default function(fetcher: Fetcher): Middleware {
  return <State>(store) => (next: Dispatch<State>) => action => {
    if (isFinalizeUploadAction(action)) {
      finalizeUpload(fetcher, store, action);
    }
    return next(action);
  };
}

export function finalizeUpload(
  fetcher: Fetcher,
  store: Store<State>,
  { file, uploadId, source, tenant }: FinalizeUploadAction,
): Promise<SendUploadEventAction> {
  const { userAuthProvider } = store.getState();
  return userAuthProvider()
    .then(mapAuthToSourceFileOwner)
    .then(owner => {
      const sourceFile = {
        ...source,
        owner,
      };
      const copyFileParams = {
        store,
        fetcher,
        file,
        uploadId,
        sourceFile,
        tenant,
      };

      return copyFile(copyFileParams);
    });
}

type CopyFileParams = {
  store: Store<State>;
  fetcher: Fetcher;
  file: MediaFile;
  uploadId: string;
  sourceFile: SourceFile;
  tenant: Tenant;
};

function copyFile({
  store,
  fetcher,
  file,
  uploadId,
  sourceFile,
  tenant,
}: CopyFileParams): Promise<SendUploadEventAction> {
  const destination = {
    auth: tenant.auth,
    collection: tenant.uploadParams.collection,
  };
  return fetcher
    .copyFile(sourceFile, destination)
    .then(destinationFile => {
      store.dispatch(
        sendUploadEvent({
          event: {
            name: 'upload-processing',
            data: {
              file: {
                ...file,
                publicId: destinationFile.id,
              },
            },
          },
          uploadId,
        }),
      );

      return fetcher.pollFile(
        tenant.auth,
        destinationFile.id,
        tenant.uploadParams.collection,
      );
    })
    .then(processedDestinationFile => {
      return store.dispatch(
        sendUploadEvent({
          event: {
            name: 'upload-end',
            data: {
              file: {
                ...file,
                publicId: processedDestinationFile.id,
              },
              public: processedDestinationFile,
            },
          },
          uploadId,
        }),
      );
    })
    .catch(error => {
      return store.dispatch(
        sendUploadEvent({
          event: {
            name: 'upload-error',
            data: {
              file,
              error: {
                name: 'object_create_fail',
                description: error.message,
              },
            },
          },
          uploadId,
        }),
      );
    });
}
