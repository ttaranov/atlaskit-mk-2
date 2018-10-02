export { default as analyticsService } from './service';
export {
  AnalyticsHandler,
  AnalyticsProperties,
  detectHandler,
  hermentHandler,
  debugHandler,
} from './handler';
export { default as analyticsDecorator } from './decorator';
export { default as trackAndInvoke } from './trackAndInvoke';

export const analyticsEventKey = 'EDITOR_ANALYTICS_EVENT';

export interface AnalyticsEventPayload {
  action: string;
  actionSubject: string;
  actionSubjectId?: string;
  attributes?: any;
}

export const fireAnalyticsEvent = createAnalyticsEvent => (
  event: AnalyticsEventPayload,
) => createAnalyticsEvent(event).fire('fabric-editor');
