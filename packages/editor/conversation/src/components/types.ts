export type createAnalyticsEvent = (
  event: object,
) => { fire: (channel: string) => void };
