import { MediaPickerContext } from '../domain/context';

import { FileFinalize } from '../service/uploadService';
import { MediaFile } from '../domain/file';
import { MediaProgress } from '../domain/progress';
import { MediaError } from '../domain/error';
import { ImagePreview } from '../domain/image';

import {
  MPFileProcessingStarted,
  MPFileUploadEnded,
} from '../outer/analytics/events';
import { MediaFileData } from '../service/mediaApi';

import { GenericEventEmitter } from '../../util/eventEmitter';
import { UploadEventPayloadMap } from '../domain/uploadEvent';

export class UploadComponent<
  M extends UploadEventPayloadMap
> extends GenericEventEmitter<M> {
  constructor(protected readonly context: MediaPickerContext) {
    super();
  }

  // Helper EventEmitter emit methods
  protected emitUploadsStart(files: MediaFile[]): void {
    this.emit('uploads-start', {
      files,
    });
  }

  protected emitUploadProgress(file: MediaFile, progress: MediaProgress): void {
    this.emit('upload-status-update', {
      file,
      progress,
    });
  }

  protected emitUploadFinalizeReady(
    file: MediaFile,
    finalize: FileFinalize,
  ): void {
    this.emit('upload-finalize-ready', { file, finalize });
  }

  protected emitUploadPreviewUpdate(
    file: MediaFile,
    preview: ImagePreview,
  ): void {
    this.emit('upload-preview-update', {
      file,
      preview,
    });
  }

  protected emitUploadProcessing(file: MediaFile): void {
    this.emit('upload-processing', { file });
    this.context.trackEvent(new MPFileProcessingStarted());
  }

  protected emitUploadEnd(file: MediaFile, mediaApiData: MediaFileData): void {
    this.emit('upload-end', { file, public: mediaApiData });
    this.context.trackEvent(new MPFileUploadEnded());
  }

  protected emitUploadError(file: MediaFile, error: MediaError): void {
    this.emit('upload-error', {
      file: file,
      error: error,
    });
  }
}
