import { Action } from 'redux';

import { MediaFile } from '../../domain/file';

export const GET_PREVIEW = 'GET_PREVIEW';

export interface GetPreviewAction extends Action {
  readonly type: 'GET_PREVIEW';
  readonly uploadId: string;
  readonly file: MediaFile;
  readonly collection: string;
}

export function getPreview(
  uploadId: string,
  file: MediaFile,
  collection: string,
): GetPreviewAction {
  return {
    type: GET_PREVIEW,
    uploadId,
    file,
    collection,
  };
}
