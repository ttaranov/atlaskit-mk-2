import { AuthProvider } from '@atlaskit/media-core';
import {
  FilePreviewUpdateEventPayload,
  FileConvertedEventPayload,
  FileConvertingEventPayload,
  FileFinalizeReadyEventPayload,
  FilesAddedEventPayload,
  FileUploadErrorEventPayload,
  FileUploadingEventPayload,
  UploadService,
} from '../service/uploadService';
import { UploadComponent } from './component';
import { MediaPickerContext } from '../domain/context';
import { ModuleConfig, UploadParams } from '../domain/config';
import { UploadEventPayloadMap } from '../domain/uploadEvent';

export class LocalUploadComponent<
  M extends UploadEventPayloadMap = UploadEventPayloadMap
> extends UploadComponent<M> {
  protected readonly uploadService: UploadService;

  constructor(
    context: MediaPickerContext,
    { apiUrl, authProvider, uploadParams }: ModuleConfig,
    userAuthProvider?: AuthProvider,
  ) {
    super(context);

    this.uploadService = new UploadService(
      apiUrl,
      authProvider,
      uploadParams || { collection: '' },
      userAuthProvider,
    );
    this.uploadService.on('files-added', this.onFilesAdded);
    this.uploadService.on('file-preview-update', this.onFilePreviewUpdate);
    this.uploadService.on('file-uploading', this.onFileUploading);
    this.uploadService.on('file-finalize-ready', this.onFileFinalizeReady);
    this.uploadService.on('file-converting', this.onFileConverting);
    this.uploadService.on('file-converted', this.onFileConverted);
    this.uploadService.on('file-upload-error', this.onUploadError);
  }

  public cancel(uniqueIdentifier?: string): void {
    this.uploadService.cancel(uniqueIdentifier);
  }

  public setUploadParams(uploadParams: UploadParams): void {
    this.uploadService.setUploadParams(uploadParams);
  }

  private onFilesAdded = ({ files }: FilesAddedEventPayload): void => {
    this.emitUploadsStart(files);
  };

  private onFilePreviewUpdate = ({
    file,
    preview,
  }: FilePreviewUpdateEventPayload): void => {
    this.emitUploadPreviewUpdate(file, preview);
  };

  private onFileUploading = ({
    file,
    progress,
  }: FileUploadingEventPayload): void => {
    this.emitUploadProgress(file, progress.toJSON());
  };

  private onFileFinalizeReady = ({
    file,
    finalize,
  }: FileFinalizeReadyEventPayload): void => {
    this.emitUploadFinalizeReady(file, finalize);
  };

  private onFileConverting = ({ file }: FileConvertingEventPayload): void => {
    this.emitUploadProcessing(file);
  };

  private onFileConverted = ({
    file,
    metadata,
  }: FileConvertedEventPayload): void => {
    this.emitUploadEnd(file, metadata);
  };

  private onUploadError = ({
    file,
    error,
  }: FileUploadErrorEventPayload): void => {
    this.emitUploadError(file, error);
  };
}
