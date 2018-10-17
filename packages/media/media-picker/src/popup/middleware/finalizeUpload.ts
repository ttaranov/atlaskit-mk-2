import { Store, Dispatch, Middleware } from 'redux';
import {
  MediaStore,
  MediaStoreCopyFileWithTokenBody,
  MediaStoreCopyFileWithTokenParams,
} from '@atlaskit/media-store';
import { Context } from '@atlaskit/media-core';
import {
  FinalizeUploadAction,
  isFinalizeUploadAction,
} from '../actions/finalizeUpload';
import { State, Tenant, SourceFile } from '../domain';
import { mapAuthToSourceFileOwner } from '../domain/source-file';
import { MediaFile } from '../../domain/file';
import { sendUploadEvent } from '../actions/sendUploadEvent';

export default function(): Middleware {
  return store => (next: Dispatch<State>) => action => {
    if (isFinalizeUploadAction(action)) {
      finalizeUpload(store as any, action);
    }
    return next(action);
  };
}

export function finalizeUpload(
  store: Store<State>,
  {
    file,
    uploadId,
    source,
    tenant,
    replaceFileId,
    occurrenceKey,
  }: FinalizeUploadAction,
) {
  const { userContext, tenantContext } = store.getState();
  userContext.config
    .authProvider()
    .then(mapAuthToSourceFileOwner)
    .then(owner => {
      const sourceFile = {
        ...source,
        owner,
      };

      const copyFileParams: CopyFileParams = {
        store,
        tenantContext,
        file,
        uploadId,
        sourceFile,
        tenant,
        replaceFileId,
        occurrenceKey,
      };

      copyFile(copyFileParams);
    });
}

type CopyFileParams = {
  store: Store<State>;
  tenantContext: Context;
  file: MediaFile;
  uploadId: string;
  sourceFile: SourceFile;
  tenant: Tenant;
  replaceFileId?: Promise<string>;
  occurrenceKey?: string;
};

async function copyFile({
  store,
  tenantContext,
  file,
  uploadId,
  sourceFile,
  tenant,
  replaceFileId,
  occurrenceKey,
}: CopyFileParams) {
  const { deferredIdUpfronts } = store.getState();
  const deferred = deferredIdUpfronts[sourceFile.id];
  const mediaStore = new MediaStore({
    authProvider: () => Promise.resolve(tenant.auth),
  });
  const body: MediaStoreCopyFileWithTokenBody = {
    sourceFile,
  };
  const params: MediaStoreCopyFileWithTokenParams = {
    collection: tenant.uploadParams.collection,
    replaceFileId: replaceFileId ? await replaceFileId : undefined,
    occurrenceKey,
  };

  const sendUploadError = (error: any) => {
    if (deferred) {
      const { rejecter } = deferred;
      rejecter();
    }

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
  };

  const sendUploadEnd = (id: string) => {
    if (deferred) {
      const { resolver } = deferred;
      resolver(id);
    }

    store.dispatch(
      sendUploadEvent({
        event: {
          name: 'upload-end',
          data: {
            file: {
              ...file,
              publicId: id,
            },
          },
        },
        uploadId,
      }),
    );
  };

  return mediaStore
    .copyFileWithToken(body, params)
    .then(destinationFile => {
      const { id: publicId } = destinationFile.data;

      store.dispatch(
        sendUploadEvent({
          event: {
            name: 'upload-processing',
            data: {
              file: {
                ...file,
                publicId,
              },
            },
          },
          uploadId,
        }),
      );

      const subscription = tenantContext.file
        .getFileState(publicId, {
          collectionName: tenant.uploadParams.collection,
        })
        .subscribe({
          next: state => {
            if (state.status === 'processed') {
              sendUploadEnd(state.id);
            } else if (
              state.status === 'failed-processing' ||
              state.status === 'error'
            ) {
              sendUploadError(state);
            }
            if (
              ['processed', 'failed-processing', 'error'].indexOf(
                state.status,
              ) > -1
            ) {
              // We need to wait for the next tick since rxjs might call "next" before returning from "subscribe"
              setImmediate(() => subscription.unsubscribe());
            }
          },
          error: error => {
            sendUploadError(error);
          },
        });
    })
    .catch(error => {
      sendUploadError(error);
    });
}
