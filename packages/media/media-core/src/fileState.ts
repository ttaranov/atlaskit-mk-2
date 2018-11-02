import {
  MediaFileProcessingStatus,
  MediaFile,
  MediaStoreResponse,
  MediaType,
  MediaFileArtifacts,
} from '@atlaskit/media-store';

export type FileStatus =
  | 'uploading'
  | 'processing'
  | 'processed'
  | 'error'
  | 'failed-processing';
export interface FilePreview {
  blob: Blob;
  originalDimensions?: {
    width: number;
    height: number;
  };
}
export interface PreviewOptions {}
export interface GetFileOptions {
  preview?: PreviewOptions;
  collectionName?: string;
  occurrenceKey?: string;
}
export interface UploadingFileState {
  status: 'uploading';
  id: string;
  occurrenceKey?: string;
  name: string;
  size: number;
  progress: number;
  mediaType: MediaType;
  mimeType: string;
  preview?: FilePreview;
}
export interface ProcessingFileState {
  status: 'processing';
  id: string;
  occurrenceKey?: string;
  name: string;
  size: number;
  mediaType: MediaType;
  mimeType: string;
  preview?: FilePreview;
}

export interface ProcessedFileState {
  status: 'processed';
  id: string;
  occurrenceKey?: string;
  name: string;
  size: number;
  artifacts: MediaFileArtifacts;
  mediaType: MediaType;
  mimeType: string;
  preview?: FilePreview;
}
export interface ProcessingFailedState {
  status: 'failed-processing';
  id: string;
  occurrenceKey?: string;
  name: string;
  size: number;
  artifacts: Object;
  mediaType: MediaType;
  mimeType: string;
  preview?: FilePreview;
}
export interface ErrorFileState {
  status: 'error';
  id: string;
  occurrenceKey?: string;
  message?: string;
}
export type FileState =
  | UploadingFileState
  | ProcessingFileState
  | ProcessedFileState
  | ErrorFileState
  | ProcessingFailedState;

export const isErrorFileState = (
  fileState: FileState,
): fileState is ErrorFileState =>
  (fileState as ErrorFileState).status === 'error';

const apiProcessingStatusToFileStatus = (
  fileStatus?: MediaFileProcessingStatus,
): FileStatus => {
  switch (fileStatus) {
    case 'pending':
      return 'processing';
    case 'succeeded':
      return 'processed';
    case 'failed':
      return 'failed-processing';
    case undefined:
      return 'processing';
  }
};

export const mapMediaFileToFileState = (
  mediaFile: MediaStoreResponse<MediaFile>,
): FileState => {
  const {
    id,
    name,
    size,
    processingStatus,
    artifacts,
    mediaType,
    mimeType,
  } = mediaFile.data;
  const status = apiProcessingStatusToFileStatus(processingStatus);

  switch (processingStatus) {
    case 'pending':
    case undefined:
      return {
        id,
        status,
        name,
        size,
        mediaType,
        mimeType,
      } as ProcessingFileState;
    case 'succeeded':
      return {
        id,
        status,
        name,
        size,
        artifacts,
        mediaType,
        mimeType,
      } as ProcessedFileState;
    case 'failed':
      return {
        id,
        status,
        name,
        size,
        artifacts,
        mediaType,
        mimeType,
      } as ProcessingFailedState;
  }
};
