// same types defined in analytics-web-client but avoid creating dependency with that
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
