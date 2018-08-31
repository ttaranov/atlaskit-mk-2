import { UploadEvent } from '../../domain/uploadEvent';
import { Tenant } from './index';

export interface LocalUploadFileMetadata {
  readonly id: string;
  readonly mimeType: string;
  readonly name: string;
  readonly size: number;
  readonly upfrontId: Promise<string>;
  readonly occurrenceKey?: string;
}

export interface LocalUploadFile {
  readonly metadata: LocalUploadFileMetadata;

  dataURI: string;
}

export interface LocalUpload {
  readonly file: LocalUploadFile;
  readonly events: UploadEvent[];
  readonly tenant: Tenant;
  readonly index: number;

  progress: number | null;
  proxy?: string[];
}

export type LocalUploads = { [uploadId: string]: LocalUpload };

export function hasLocalUploadStartedProcessing(
  localUpload: LocalUpload,
): boolean {
  return localUpload.events.some(event => event.name === 'upload-processing');
}
