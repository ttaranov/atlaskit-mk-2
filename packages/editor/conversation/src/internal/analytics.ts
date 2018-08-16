export const ANALYTICS_CHANNEL = 'fabric-editor';

export type createAnalyticsEvent = (event: object) => AnalyticsEvent;

export enum actionSubjectIds {
  createCommentButton = 'createCommentButton',
  createCommentInput = 'createCommentInput',
  editButton = 'editButton',
  cancelFailedRequestButton = 'cancelFailedRequestButton',
  retryFailedRequestButton = 'retryFailedRequestButton',
  deleteButton = 'deleteButton',
  saveButton = 'saveButton',
  cancelButton = 'cancelButton',
  replyButton = 'replyButton',
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
  nestedDepth?: number,
) {
  analyticsEvent.update({
    actionSubjectId: actionSubjectId,
    containerId: containerId,
    attributes: {
      ...analyticsEvent.attributes,
      nestedDepth,
    },
  });
  analyticsEvent.fire(ANALYTICS_CHANNEL);
}
