import { Context } from '@atlaskit/media-core';
import {
  UploadEndEventPayload,
  UploadErrorEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadProcessingEventPayload,
  UploadsStartEventPayload,
  UploadStatusUpdateEventPayload,
  UploadParams,
} from '..';
import { NewUploadServiceImpl } from './newUploadServiceImpl';

export type UploadServiceEventPayloadTypes = {
  readonly 'files-added': UploadsStartEventPayload;
  readonly 'file-preview-update': UploadPreviewUpdateEventPayload;
  readonly 'file-uploading': UploadStatusUpdateEventPayload;
  readonly 'file-converting': UploadProcessingEventPayload;
  readonly 'file-converted': UploadEndEventPayload;
  readonly 'file-upload-error': UploadErrorEventPayload;
  readonly 'file-dropped': DragEvent;
};

export type UploadServiceEventListener<
  E extends keyof UploadServiceEventPayloadTypes
> = (payload: UploadServiceEventPayloadTypes[E]) => void;

export const MAX_FILE_SIZE_FOR_PREVIEW = 10e6; // 10 MB

export interface UploadService {
  setUploadParams(uploadParams?: UploadParams);
  addFiles(files: File[]);
  cancel(id?: string);
  on<E extends keyof UploadServiceEventPayloadTypes>(
    event: E,
    listener: UploadServiceEventListener<E>,
  );
  off<E extends keyof UploadServiceEventPayloadTypes>(
    event: E,
    listener: UploadServiceEventListener<E>,
  );
}

export class UploadServiceFactory {
  public static create(
    context: Context,
    tenantUploadParams: UploadParams,
    uploadParams?: UploadParams,
  ): UploadService {
    return new NewUploadServiceImpl(context, tenantUploadParams, uploadParams);
  }
}
