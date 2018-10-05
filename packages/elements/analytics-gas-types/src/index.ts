// same types defined in analytics-web-client but avoid creating dependency with that
import { AnalyticsEventPayload } from '@atlaskit/analytics-next-types';
export const UI_EVENT_TYPE = 'ui';
export const TRACK_EVENT_TYPE = 'track';
export const SCREEN_EVENT_TYPE = 'screen';
export const OPERATIONAL_EVENT_TYPE = 'operational';

export const DEFAULT_SOURCE = 'unknown';

export type EventType = 'ui' | 'track' | 'screen' | 'operational';

export type GasScreenEventPayload = {
  name: string;
  eventType: EventType;
  attributes?: {
    [key: string]: any;
  };
  tags?: Array<string>;
};

export type GasCorePayload = {
  actionSubject: string;
  actionSubjectId?: string;
  eventType: EventType;
  attributes?: {
    packageName?: string;
    packageVersion?: string;
    componentName?: string;
    [key: string]: any;
  };
  nonPrivacySafeAttributes?: {
    [key: string]: any;
  };
  tags?: Array<string>;
  source?: string;
};

export type GasPayload = AnalyticsEventPayload & GasCorePayload;
