//@flow
import { type AnalyticsEventPayload } from './types';
import { type CreateUIAnalyticsEventSignature } from './withAnalyticsEvents';

export default (channel?: string) => (payload: AnalyticsEventPayload) => (
  createAnalyticsEvent: CreateUIAnalyticsEventSignature,
) => {
  const consumerEvent = createAnalyticsEvent(payload);
  consumerEvent.clone().fire(channel);
  return consumerEvent;
};
