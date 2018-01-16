import { Action } from 'redux';

import {
  UploadEndEvent,
  UploadEndEventPayload,
} from '../../../src/domain/uploadEvent';
import { MediaFile } from '../../../src/domain/file';
export const FILE_UPLOAD_END = 'FILE_UPLOAD_END';

export interface FileUploadEndAction extends Action {
  readonly type: 'FILE_UPLOAD_END';
  readonly file: MediaFile;
  readonly publicFile: object;
  readonly originalEvent: UploadEndEvent;
}

export function isFileUploadEndAction(
  action: Action,
): action is FileUploadEndAction {
  return action.type === FILE_UPLOAD_END;
}

export function fileUploadEnd(
  payload: UploadEndEventPayload,
): FileUploadEndAction {
  return {
    type: FILE_UPLOAD_END,
    file: payload.file,
    publicFile: payload.public,
    originalEvent: {
      name: 'upload-end',
      data: payload,
    },
  };
}
