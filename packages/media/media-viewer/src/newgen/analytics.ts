import { createAndFireEvent } from '@atlaskit/analytics-next';
export const channel = 'media';
export const createAndFireEventOnMedia = createAndFireEvent(channel);

export type onViewerLoadPayload = {
  status: 'success' | 'error';
  duration: number;
};

export type AnalyticViewerProps = {
  onLoaded: (payload: onViewerLoadPayload) => void;
};
