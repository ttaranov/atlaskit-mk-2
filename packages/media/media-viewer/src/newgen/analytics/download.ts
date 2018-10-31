import { GasPayload } from '@atlaskit/analytics-gas-types';
import {
  context,
  fileStateToFileGasPayload,
  FileGasPayload,
  PackageContext,
} from './index';
import { FileState, FileStatus } from '@atlaskit/media-core';
import { MediaViewerError } from '../error';

interface DownloadAttributes extends FileGasPayload {
  fileSupported?: boolean;
  fileProcessingStatus: FileStatus;
}

const getBasePayload = (actionSubjectId: string): GasPayload => ({
  eventType: 'ui',
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId,
});

const getBaseAttributes = (state: FileState) => ({
  ...fileStateToFileGasPayload(state),
  fileProcessingStatus: state.status,
  ...context,
});

const downloadEvent = (
  state: FileState,
  actionSubjectId: string,
  failReason?: string,
) => {
  const basePayload = getBasePayload(actionSubjectId);
  const baseAttributes = failReason
    ? {
        ...getBaseAttributes(state),
        failReason,
      }
    : getBaseAttributes(state);
  switch (state.status) {
    case 'processed':
    case 'uploading':
    case 'processing':
    case 'failed-processing':
      return {
        ...basePayload,
        attributes: {
          ...baseAttributes,
          fileSupported: state.mediaType !== 'unknown',
        },
      };
    case 'error':
      return {
        ...basePayload,
        attributes: {
          ...baseAttributes,
        },
      };
  }
};

export interface DownloadGasPayload extends GasPayload {
  attributes: DownloadAttributes & PackageContext;
}

export function downloadErrorButtonEvent(
  state: FileState,
  err: MediaViewerError,
): DownloadGasPayload {
  return downloadEvent(state, 'failedPreviewDownloadButton', err.errorName);
}

export function downloadButtonEvent(state: FileState): DownloadGasPayload {
  return downloadEvent(state, 'downloadButton');
}
