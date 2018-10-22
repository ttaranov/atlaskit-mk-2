import { createAndFireEvent } from '@atlaskit/analytics-next';
import { FileState } from '@atlaskit/media-core';
import { MediaType } from '@atlaskit/media-store';
import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';

export const channel = 'media';
export const createAndFireEventOnMedia = createAndFireEvent(channel);

export const context: PackageContext = {
  componentName: 'media-viewer',
  packageName,
  packageVersion,
};

export interface PackageContext {
  componentName: string;
  packageName: string;
  packageVersion: string;
}
export interface FileGasPayload {
  fileId: string;
  fileMediatype?: MediaType;
  fileMimetype?: string;
  fileSize?: number;
}

export function fileStateToFileGasPayload(state: FileState): FileGasPayload {
  const basePayload = {
    fileId: state.id,
  };
  switch (state.status) {
    case 'uploading':
    case 'failed-processing':
    case 'processing':
    case 'processed':
      return {
        ...basePayload,
        fileMediatype: state.mediaType,
        fileMimetype: state.mimeType,
        fileSize: state.size,
      };
    case 'error':
      return basePayload;
  }
}
