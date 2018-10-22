import { Action, MiddlewareAPI } from 'redux';
import { TRACK_EVENT_TYPE } from '@atlaskit/analytics-gas-types';
import { State } from '../../domain';
import { isFileUploadEndAction } from '../../actions/fileUploadEnd';
import { HandlerResult } from '.';

export default (action: Action, store: MiddlewareAPI<State>): HandlerResult => {
  if (isFileUploadEndAction(action)) {
    const { file } = action;
    const state = action.originalEvent.data.state;

    const timeStarted = store.getState().uploads[file.id].timeStarted;

    return [
      {
        action: 'uploaded',
        actionSubject: 'mediaUpload',
        actionSubjectId: 'localMedia',
        attributes: {
          fileAttributes: {
            fileMediatype: state.mediaType,
            fileState: state.status,
            fileSize: state.size,
            fileMimetype: state.mimeType,
            fileSource: 'mediapicker',
          },
          status: 'success',
          uploadDurationMsec:
            timeStarted !== undefined ? Date.now() - timeStarted : -1,
        },
        eventType: TRACK_EVENT_TYPE,
      },
    ];
  }
};
