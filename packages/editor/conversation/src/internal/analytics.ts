export function fireEvent(action, analyticsEvent) {
  analyticsEvent.update({ actionSubjectId: action, action: 'clicked' });
  analyticsEvent.fire(ANALYTICS_CHANNEL);
}

export const ANALYTICS_CHANNEL = 'fabric-editor';

export type createAnalyticsEvent = (
  event: object,
) => { fire: (channel: string) => void };
