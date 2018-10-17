export type Reason =
  | 'OFF'
  | 'FALLTHROUGH'
  | 'RULE_MATCH'
  | 'TARGET_MATCH'
  | 'INELIGIBLE';

export type RuleId = string;

export type FlagShape = {
  value: boolean | string | object;
  explanation?: {
    kind: Reason;
    ruleId?: RuleId;
    ruleIndex?: number;
  };
};

export type Flags = {
  [flagName: string]: FlagShape;
};

export type ExposureEvent = {
  action: string;
  actionSubject: string;
  attributes: {
    flagKey: string;
    reason: Reason;
    ruleId?: RuleId;
    value: boolean | string | object;
  };
  source: string;
};

export interface FlagConstructor {
  new (
    flagKey: string,
    flag: FlagShape,
    trackExposure: (flagKey: string, flag: FlagShape) => void,
  ): Flag;
}
export interface Flag {
  getBooleanValue(options: {
    default: boolean;
    shouldTrackExposureEvent?: boolean;
  }): boolean;

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
  }): string;

  getJSONValue(): object;
}
