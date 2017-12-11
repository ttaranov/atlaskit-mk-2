import { Action } from 'redux';

import { Tenant } from '../domain';
import { MediaFile } from '../../domain/file';

export const FINALIZE_UPLOAD = 'FINALIZE_UPLOAD';

export interface FinalizeUploadSource {
  readonly id: string;
  readonly collection?: string;
}

export interface FinalizeUploadAction extends Action {
  readonly type: 'FINALIZE_UPLOAD';
  readonly file: MediaFile;
  readonly uploadId: string;
  readonly source: FinalizeUploadSource;
  readonly tenant: Tenant;
}

export function finalizeUpload(
  file: MediaFile,
  uploadId: string,
  source: FinalizeUploadSource,
  tenant: Tenant,
): FinalizeUploadAction {
  return {
    type: FINALIZE_UPLOAD,
    file,
    uploadId,
    source,
    tenant,
  };
}
