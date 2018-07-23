export const ANALYTICS_CHANNEL = 'fabric-editor';

export type createAnalyticsEvent = (event: object) => AnalyticsEvent;

export enum actionSubjectIds {
  commentCreateStart = 'commentCreateStart',
  commentEditStart = 'commentEditStart',
  commentRequestCancel = 'commentRequestCancel',
  commentRequestRetry = 'commentRequestRetry',
  commentDelete = 'commentDelete',
  commentCreateSave = 'commentCreateSave',
  commentCreateCancel = 'commentCreateCancel',
  commentEditSave = 'commentEditSave',
  commentEditCancel = 'commentEditCancel',
}

export interface AnalyticsEvent {
  update: (attributes: object) => void;
  fire: (channel: string) => void;
  attributes: object;
}

export function fireEvent(
  analyticsEvent: AnalyticsEvent,
  actionSubjectId: actionSubjectIds,
  containerId: string = '',
  commentLevel?: number,
) {
  analyticsEvent.update({
    actionSubjectId: actionSubjectId,
    containerId: containerId,
    attributes: {
      ...analyticsEvent.attributes,
      commentLevel,
    },
  });
  analyticsEvent.fire(ANALYTICS_CHANNEL);
}
