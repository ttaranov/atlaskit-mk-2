import { createAndFireEvent } from '@atlaskit/analytics-next';
export const channel = 'media';
export const createAndFireEventOnMedia = createAndFireEvent(channel);

export type onViewerLoadPayload = {
  status: 'success' | 'error';
  duration: number;
};

// export type analyticsCommonPayload = {
//   action: string;
//   status: 'success' | 'fail';
//   fileId: string;
//   fileSize?: number;
//   fileMimetype?: string;
// };

// export type onItemLoadedPayload = analyticsCommonPayload & {
//   loadDurationMsec?: number;
//   metadataDurationMsec?: number;
//   failReason?: string;
//   viewerDurationMsec?: number;
// };

export type AnalyticViewerProps = {
  onLoaded: (payload: onViewerLoadPayload) => void;
};
