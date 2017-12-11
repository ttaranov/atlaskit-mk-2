import { MediaFileData } from '../service/mediaApi';
import { MediaProgress } from './progress';
import { MediaError } from './error';
import { ImagePreview } from './image';
import { FileFinalize } from '../service/uploadService';
import { MediaFile } from './file';

export type SelectedUploadFile = {
  readonly file: MediaFile;
  readonly uploadId: string;
  readonly serviceName: string;
  readonly accountId?: string;
};

export type UploadsStartEventPayload = {
  readonly files: MediaFile[];
};

export type UploadPreviewUpdateEventPayload = {
  readonly file: MediaFile;
  readonly preview: ImagePreview;
};

export type UploadStatusUpdateEventPayload = {
  readonly file: MediaFile;
  readonly progress: MediaProgress;
};

export type UploadProcessingEventPayload = {
  readonly file: MediaFile;
};

export type UploadEndEventPayload = {
  readonly file: MediaFile;
  readonly public: MediaFileData;
};

export type UploadErrorEventPayload = {
  readonly file: MediaFile;
  readonly error: MediaError;
};

export type UploadFinalizeReadyEventPayload = {
  readonly file: MediaFile;
  readonly finalize: FileFinalize;
};

export type UploadEventPayloadMap = {
  readonly 'uploads-start': UploadsStartEventPayload;
  readonly 'upload-preview-update': UploadPreviewUpdateEventPayload;
  readonly 'upload-status-update': UploadStatusUpdateEventPayload;
  readonly 'upload-processing': UploadProcessingEventPayload;
  readonly 'upload-end': UploadEndEventPayload;
  readonly 'upload-error': UploadErrorEventPayload;
  readonly 'upload-finalize-ready': UploadFinalizeReadyEventPayload;
};

export type UploadEventMap = {
  readonly [K in keyof UploadEventPayloadMap]: {
    readonly name: K;
    readonly data: UploadEventPayloadMap[K];
  }
};

export type UploadEvent = UploadEventMap[keyof UploadEventMap];

export type UploadsStartEvent = UploadEventMap['uploads-start'];
export type UploadPreviewUpdateEvent = UploadEventMap['upload-preview-update'];
export type UploadStatusUpdateEvent = UploadEventMap['upload-status-update'];
export type UploadProcessingEvent = UploadEventMap['upload-processing'];
export type UploadEndEvent = UploadEventMap['upload-end'];
export type UploadErrorEvent = UploadEventMap['upload-error'];
export type UploadFinalizeReadyEvent = UploadEventMap['upload-finalize-ready'];
