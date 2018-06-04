// same types defined in analytics-web-client but avoid creating dependency with that

export const UI_EVENT_TYPE = 'ui';
export const TRACK_EVENT_TYPE = 'track';
export const SCREEN_EVENT_TYPE = 'screen';
export const OPERATIONAL_EVENT_TYPE = 'operational';

export type EventType = 'ui' | 'track' | 'screen' | 'operational';

export type GasPayload = {
  action: string;
  actionSubject: string;
  actionSubjectId?: string;
  eventType: EventType;
  attributes?: {
    packageName: string;
    packageVersion: string;
    componentName: string;
    [key: string]: any;
  };
  tags?: Array<string>;
  source: string;
};
