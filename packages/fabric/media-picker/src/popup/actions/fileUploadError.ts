import { Action } from 'redux';

import { MediaError } from '../../domain/error';
import {
  UploadErrorEvent,
  UploadErrorEventPayload,
} from '../../domain/uploadEvent';
import { MediaFile } from '../../domain/file';

export const FILE_UPLOAD_ERROR = 'FILE_UPLOAD_ERROR';
export const DISMISS_FILE_UPLOAD_ERROR = 'DISMISS_FILE_UPLOAD_ERROR';

export interface FileUploadErrorAction extends Action {
  readonly type: 'FILE_UPLOAD_ERROR';
  readonly file?: MediaFile;
  readonly error: MediaError;
  readonly originalEvent: UploadErrorEvent;
}

export interface DismissFileUploadErrorAction extends Action {
  readonly type: 'DISMISS_FILE_UPLOAD_ERROR';
}

export function isFileUploadErrorAction(
  action: Action,
): action is FileUploadErrorAction {
  return action.type === FILE_UPLOAD_ERROR;
}

export function isDismissFileUploadErrorAction(
  action: Action,
): action is DismissFileUploadErrorAction {
  return action.type === DISMISS_FILE_UPLOAD_ERROR;
}

export function fileUploadError(
  payload: UploadErrorEventPayload,
): FileUploadErrorAction {
  return {
    type: FILE_UPLOAD_ERROR,
    file: payload.file,
    error: payload.error,
    originalEvent: {
      name: 'upload-error',
      data: payload,
    },
  };
}

export function dismissUploadError(
): DismissFileUploadErrorAction {
  return {
    type: DISMISS_FILE_UPLOAD_ERROR
  }
}