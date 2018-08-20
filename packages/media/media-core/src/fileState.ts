import {
  MediaFileProcessingStatus,
  MediaFile,
  MediaStoreResponse,
  MediaType,
} from '@atlaskit/media-store';

export type FileStatus = 'uploading' | 'processing' | 'processed' | 'error';
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
  name: string;
  size: number;
  mediaType: MediaType;
  mimeType: string;
  preview?: FilePreview;
}
export interface ProcessedFileState {
  status: 'processed';
  id: string;
  name: string;
  size: number;
  artifacts: Object;
  mediaType: MediaType;
  mimeType: string;
  binaryUrl: string;
  preview?: FilePreview;
}
export interface ErrorFileState {
  status: 'error';
  id: string;
  message?: string;
}
export type FileState =
  | UploadingFileState
  | ProcessingFileState
  | ProcessedFileState
  | ErrorFileState;

const apiProcessingStatusToFileStatus = (
  fileStatus?: MediaFileProcessingStatus,
): FileStatus => {
  switch (fileStatus) {
    case 'pending':
      return 'processing';
    case 'succeeded':
      return 'processed';
    case 'failed':
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

  switch (status) {
    case 'uploading':
      return {
        id,
        status,
        name,
        size,
        mediaType,
        mimeType,
        progress: 0,
      };
    case 'processing':
      return {
        id,
        status,
        name,
        size,
        mediaType,
        mimeType,
      };
    case 'processed':
      return {
        id,
        status,
        name,
        size,
        artifacts,
        mediaType,
        mimeType,
        binaryUrl: `/file/${id}/binary`,
      };
    case 'error':
      return {
        id,
        status,
      };
  }
};
