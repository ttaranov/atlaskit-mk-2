export type Reason =
  | 'OFF'
  | 'FALLTHROUGH'
  | 'RULE_MATCH'
  | 'TARGET_MATCH'
  | 'INELIGIBLE';

export type RuleId = string;

export type DarkFeature = boolean;

export type JSONFlag = object;

export type FeatureFlag = {
  trackEvents: boolean;
  value: boolean | string | object;
  explanation: {
    reason: Reason;
    ruleId?: RuleId;
  };
  [key: string]: any;
};

export type AnyFlag = DarkFeature | FeatureFlag | JSONFlag;

export type Flags = {
  [flagName: string]: AnyFlag;
};

export type ExposureEvent = {
  action: string;
  actionSubject: string;
  attributes: {
    reason: Reason;
    ruleId?: RuleId;
    value: boolean | string | object;
  };
};

export type AnalyticsClient = {
  sendTrackEvent: (event: ExposureEvent) => void;
};

export interface FlagConstructor {
  new (
    flagKey: string,
    flag: AnyFlag,
    trackExposure: (flagKey: string, flag: FeatureFlag) => void,
  ): Flag;
}
export interface Flag {
  getBooleanValue(options: {
    default: boolean;
    trackExposureEvent?: boolean;
  }): boolean;

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    trackExposureEvent?: boolean;
  }): string;

  getJSONValue(): object;
}
