import {
  GasPayload,
  GasScreenEventPayload,
} from '@atlaskit/analytics-gas-types';
import { ProcessedFileState } from '@atlaskit/media-core';
import { context, fileStateToFileGasPayload } from './index';

export type ViewerLoadPayload = {
  status: 'success' | 'error';
  errorMessage?: string;
};

export type AnalyticViewerProps = {
  onLoad: (payload: ViewerLoadPayload) => void;
};

const loadedEventPayload: GasPayload = {
  action: 'loaded',
  actionSubject: 'mediaFile',
  eventType: 'operational',
};

export const itemViewerErrorEvent = (
  id: string,
  failReason: string,
  file?: ProcessedFileState,
): GasPayload => {
  const fileAttributes = file
    ? fileStateToFileGasPayload(file)
    : {
        fileId: id,
      };
  return {
    ...loadedEventPayload,
    actionSubjectId: id,
    attributes: {
      status: 'fail',
      ...fileAttributes,
      failReason,
      ...context,
    },
  };
};

export const itemViewerLoadedEvent = (file: ProcessedFileState): GasPayload => {
  return {
    ...loadedEventPayload,
    actionSubjectId: file.id,
    attributes: {
      status: 'success',
      ...fileStateToFileGasPayload(file),
      ...context,
    },
  };
};

export const itemViewerCommencedEvent = (id: string): GasPayload => {
  return {
    action: 'commenced',
    actionSubject: 'mediaFile',
    actionSubjectId: id,
    eventType: 'operational',
    attributes: {
      fileId: id,
      ...context,
    },
  };
};

export const mediaViewerModalScreenEvent = (
  id: string,
): GasScreenEventPayload => {
  return {
    eventType: 'screen',
    name: 'mediaViewerModal',
    attributes: {
      fileId: id,
      ...context,
    },
  };
};
