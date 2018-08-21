// same types defined in analytics-web-client but avoid creating dependency with that
import { AnalyticsEventPayload } from '@atlaskit/analytics-next-types';
export const UI_EVENT_TYPE = 'ui';
export const TRACK_EVENT_TYPE = 'track';
export const SCREEN_EVENT_TYPE = 'screen';
export const OPERATIONAL_EVENT_TYPE = 'operational';

export type EventType = 'ui' | 'track' | 'screen' | 'operational';

export type ScreenAnalyticsEventPayload = {
  name: string;
  [key: string]: any;
};

export type BasePayload =
  | AnalyticsEventPayload & {
      actionSubject: string;
      actionSubjectId?: string;
      source: string;
    }
  | ScreenAnalyticsEventPayload;

export type GasPayload = BasePayload & {
  eventType: EventType;
  attributes?: {
    packageName: string;
    packageVersion: string;
    componentName: string;
    [key: string]: any;
  };
  nonPrivacySafeAttributes?: {
    [key: string]: any;
  };
  tags?: Array<string>;
};
