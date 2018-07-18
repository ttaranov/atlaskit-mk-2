export function fireEvent(action, analyticsEvent) {
  analyticsEvent.payload.action = action;
  analyticsEvent.fire(ANALYTICS_CHANNEL);
}

export const ANALYTICS_CHANNEL = 'editor';
