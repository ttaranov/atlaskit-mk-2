import { MediaPickerContext } from '../domain/context';

import { FileFinalize } from '../service/uploadService';
import { MediaFile, PublicMediaFile } from '../domain/file';
import { MediaProgress } from '../domain/progress';
import { MediaError } from '../domain/error';
import { Preview } from '../domain/preview';

import {
  MPFileProcessingStarted,
  MPFileUploadEnded,
} from '../outer/analytics/events';
import { MediaFileData } from '../service/mediaApi';

import { GenericEventEmitter } from '../util/eventEmitter';
import { UploadEventPayloadMap } from '../domain/uploadEvent';

export interface UploadEventEmitter {
  emitUploadsStart(files: MediaFile[]): void;
  emitUploadProgress(file: MediaFile, progress: MediaProgress): void;
  emitUploadFinalizeReady(file: MediaFile, finalize: FileFinalize): void;
  emitUploadPreviewUpdate(file: MediaFile, preview: Preview): void;
  emitUploadProcessing(file: PublicMediaFile): void;
  emitUploadEnd(file: PublicMediaFile, mediaApiData: MediaFileData): void;
  emitUploadError(file: MediaFile, error: MediaError): void;
}

export class UploadComponent<
  M extends UploadEventPayloadMap
> extends GenericEventEmitter<M> implements UploadEventEmitter {
  constructor(protected readonly context: MediaPickerContext) {
    super();
  }

  emitUploadsStart(files: MediaFile[]): void {
    this.emit('uploads-start', {
      files,
    });
  }

  emitUploadProgress(file: MediaFile, progress: MediaProgress): void {
    this.emit('upload-status-update', {
      file,
      progress,
    });
  }

  emitUploadFinalizeReady(file: MediaFile, finalize: FileFinalize): void {
    this.emit('upload-finalize-ready', { file, finalize });
  }

  emitUploadPreviewUpdate(file: MediaFile, preview: Preview): void {
    this.emit('upload-preview-update', {
      file,
      preview,
    });
  }

  emitUploadProcessing(file: PublicMediaFile): void {
    this.emit('upload-processing', { file });
    this.context.trackEvent(new MPFileProcessingStarted());
  }

  emitUploadEnd(file: PublicMediaFile, mediaApiData: MediaFileData): void {
    this.emit('upload-end', { file, public: mediaApiData });
    this.context.trackEvent(new MPFileUploadEnded());
  }

  emitUploadError(file: MediaFile, error: MediaError): void {
    this.emit('upload-error', {
      file: file,
      error: error,
    });
  }
}
