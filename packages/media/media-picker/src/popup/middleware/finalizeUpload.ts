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
import { AuthService } from '../../domain/auth';

export default function(
  fetcher: Fetcher,
  authService: AuthService,
): Middleware {
  return <State>(store) => (next: Dispatch<State>) => action => {
    if (isFinalizeUploadAction(action)) {
      finalizeUpload(fetcher, authService, store, action);
    }
    return next(action);
  };
}

export function finalizeUpload(
  fetcher: Fetcher,
  authService: AuthService,
  store: Store<State>,
  { file, uploadId, source, tenant }: FinalizeUploadAction,
): Promise<SendUploadEventAction> {
  return authService
    .getUserAuth()
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
  const { apiUrl } = store.getState();
  const destination = {
    auth: tenant.auth,
    collection: tenant.uploadParams.collection,
  };
  return fetcher
    .copyFile(apiUrl, sourceFile, destination)
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
        apiUrl,
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
