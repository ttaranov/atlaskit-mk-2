import { createAndFireEvent } from '@atlaskit/analytics-next';
export const channel = 'media';
export const createAndFireEventOnMedia = createAndFireEvent(channel);
import { GasPayload } from '@atlaskit/analytics-gas-types';
import { ProcessedFileState } from '@atlaskit/media-core';

export type ViewerLoadPayload = {
  status: 'success' | 'error';
};

export type AnalyticViewerProps = {
  onLoad: (payload: ViewerLoadPayload) => void;
};

const loadedEventPayload: GasPayload = {
  action: 'loaded',
  actionSubject: 'mediaFile',
  eventType: 'operational',
};

function getAttributesForFile(id: string, file?: ProcessedFileState) {
  if (file) {
    return {
      fileId: file.id,
      fileMediatype: file.mediaType,
      fileSize: file.size,
    };
  } else {
    return {
      fileId: id,
    };
  }
}

export const itemViewerErrorEvent = (
  id: string,
  failReason: string,
  file?: ProcessedFileState,
): GasPayload => {
  return {
    ...loadedEventPayload,
    actionSubjectId: id,
    attributes: {
      status: 'fail',
      ...getAttributesForFile(id, file),
      failReason,
    },
  };
};

export const itemViewerLoadedEvent = (file: ProcessedFileState): GasPayload => {
  return {
    ...loadedEventPayload,
    actionSubjectId: file.id,
    attributes: {
      status: 'success',
      ...getAttributesForFile(file.id, file),
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
    },
  };
};
