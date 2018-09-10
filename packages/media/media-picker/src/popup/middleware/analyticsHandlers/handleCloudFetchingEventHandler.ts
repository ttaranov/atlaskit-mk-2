import {
  TRACK_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';
import { Action, MiddlewareAPI } from 'redux';
import { State } from '../../domain';
import { isHandleCloudFetchingEventAction } from '../../actions/handleCloudFetchingEvent';
import { Payload } from '.';

const commonPayload = {
  actionSubject: 'mediaUpload',
  actionSubjectId: 'cloudMedia',
};

const fileAttributes = (file: any) => ({
  fileSize: file.size,
  fileMimetype: file.type,
  fileSource: 'mediapicker',
});

const source = 'mediaPickerModal';

export default (
  action: Action,
  store: MiddlewareAPI<State>,
): Payload[] | undefined => {
  if (isHandleCloudFetchingEventAction(action)) {
    const { event, payload, file } = action;
    const timeStarted = store.getState().remoteUploads[payload.uploadId]
      .timeStarted;

    if (event === 'RemoteUploadStart') {
      return [
        {
          action: 'commenced',
          ...commonPayload,
          attributes: {
            fileAttributes: fileAttributes(file),
          },
          eventType: OPERATIONAL_EVENT_TYPE,
          source,
        },
      ];
    } else if (event === 'RemoteUploadEnd') {
      return [
        {
          action: 'uploaded',
          ...commonPayload,
          attributes: {
            fileAttributes: fileAttributes(file),
            status: 'success',
            uploadDurationMsec:
              timeStarted !== undefined ? Date.now() - timeStarted : -1,
          },
          eventType: TRACK_EVENT_TYPE,
          source,
        },
      ];
    } else if (event === 'RemoteUploadFail') {
      return [
        {
          action: 'uploaded',
          ...commonPayload,
          attributes: {
            fileAttributes: fileAttributes(file),
            status: 'fail',
            uploadDurationMsec:
              timeStarted !== undefined ? Date.now() - timeStarted : -1,
          },
          eventType: TRACK_EVENT_TYPE,
          source,
        },
      ];
    } else {
      return [];
    }
  }

  return undefined;
};
