import { Action } from 'redux';

import {
  UploadStatusUpdateEvent,
  UploadStatusUpdateEventPayload,
} from '../../../src/domain/uploadEvent';
import { MediaFile } from '../../../src/domain/file';

export interface FileUploadProgressAction extends Action {
  readonly type: 'FILE_UPLOAD_PROGRESS';
  readonly file: MediaFile;
  readonly progress: number;
  readonly originalEvent: UploadStatusUpdateEvent;
}

export function isFileUploadProgressAction(
  action: Action,
): action is FileUploadProgressAction {
  return action.type === 'FILE_UPLOAD_PROGRESS';
}

export function fileUploadProgress(
  payload: UploadStatusUpdateEventPayload,
): FileUploadProgressAction {
  return {
    type: 'FILE_UPLOAD_PROGRESS',
    file: payload.file,
    progress: payload.progress.portion,
    originalEvent: {
      name: 'upload-status-update',
      data: payload,
    },
  };
}
