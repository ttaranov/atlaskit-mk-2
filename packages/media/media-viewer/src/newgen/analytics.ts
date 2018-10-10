import { createAndFireEvent } from '@atlaskit/analytics-next';
export const channel = 'media';
export const createAndFireEventOnMedia = createAndFireEvent(channel);

export type ViewerLoadPayload = {
  status: 'success' | 'error';
};

export type AnalyticViewerProps = {
  onLoaded: (payload: ViewerLoadPayload) => void;
};
