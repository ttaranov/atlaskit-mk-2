import { Store, Dispatch } from 'redux';

import { AuthService } from '../services/auth-service';
import { Fetcher } from '../tools/fetcher/fetcher';
import { FinalizeUploadAction } from '../actions/finalizeUpload';
import { ParentChannel } from '../interactors/parentChannel';
import { State, Tenant, SourceFile } from '../domain';
import { mapAuthToSourceFileOwner } from '../domain/source-file';
import { MediaFile } from '../../domain/file';

export const finalizeUpload = (
  fetcher: Fetcher,
  authService: AuthService,
  parentChannel: ParentChannel,
) => (store: Store<State>) => (next: Dispatch<State>) => (
  action: FinalizeUploadAction,
) => {
  if (action.type === 'FINALIZE_UPLOAD') {
    authService
      .getUserAuth()
      .then(mapAuthToSourceFileOwner)
      .then(owner => {
        const { apiUrl } = store.getState();
        const { file, uploadId, source, tenant } = action;
        const sourceFile = {
          ...source,
          owner,
        };
        const copyFileParams = {
          fetcher,
          parentChannel,
          file,
          uploadId,
          apiUrl,
          sourceFile,
          tenant,
        };

        if (tenant.uploadParams.autoFinalize === false) {
          parentChannel.sendUploadEvent(
            {
              name: 'upload-finalize-ready',
              data: {
                file,
                finalize: () => copyFile(copyFileParams),
              },
            },
            uploadId,
          );
        } else {
          copyFile(copyFileParams);
        }
      });
  }
  return next(action);
};

type CopyFileParams = {
  fetcher: Fetcher;
  parentChannel: ParentChannel;
  file: MediaFile;
  uploadId: string;
  apiUrl: string;
  sourceFile: SourceFile;
  tenant: Tenant;
};

function copyFile({
  fetcher,
  parentChannel,
  file,
  uploadId,
  apiUrl,
  sourceFile,
  tenant,
}: CopyFileParams): void {
  const destination = {
    auth: tenant.auth,
    collection: tenant.uploadParams.collection,
  };
  fetcher
    .copyFile(apiUrl, sourceFile, destination)
    .then(destinationFile => {
      const { fetchMetadata } = tenant.uploadParams;

      if (fetchMetadata) {
        parentChannel.sendUploadEvent(
          {
            name: 'upload-processing',
            data: {
              file,
            },
          },
          uploadId,
          destinationFile.id,
        );

        return fetcher.pollFile(
          apiUrl,
          tenant.auth,
          destinationFile.id,
          tenant.uploadParams.collection,
        );
      } else {
        return Promise.resolve({ id: destinationFile.id });
      }
    })
    .then(processedDestinationFile => {
      parentChannel.sendUploadEvent(
        {
          name: 'upload-end',
          data: {
            file,
            public: processedDestinationFile,
          },
        },
        uploadId,
        processedDestinationFile.id,
      );
    })
    .catch(error => {
      parentChannel.sendUploadEvent(
        {
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
      );
    });
}
