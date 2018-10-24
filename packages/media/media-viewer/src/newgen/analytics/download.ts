import { GasPayload } from '@atlaskit/analytics-gas-types';
import {
  context,
  fileStateToFileGasPayload,
  FileGasPayload,
  PackageContext,
} from './index';
import { FileState, FileStatus } from '@atlaskit/media-core';

interface DownloadAttributes extends FileGasPayload {
  fileSupported?: boolean;
  fileProcessingStatus: FileStatus;
}
interface DownloadGasPayload extends GasPayload {
  attributes: DownloadAttributes & PackageContext;
}

export function downloadButtonEvent(file: FileState): DownloadGasPayload {
  const basePayload: GasPayload = {
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'downloadButton',
  };

  const baseAttributes = {
    ...fileStateToFileGasPayload(file),
    fileProcessingStatus: file.status,
    ...context,
  };

  switch (file.status) {
    case 'processed':
    case 'uploading':
    case 'processing':
    case 'failed-processing':
      return {
        ...basePayload,
        attributes: {
          ...baseAttributes,
          fileSupported: file.mediaType !== 'unknown',
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
}
