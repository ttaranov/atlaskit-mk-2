export type Reason =
  | 'OFF'
  | 'FALLTHROUGH'
  | 'RULE_MATCH'
  | 'TARGET_MATCH'
  | 'INELIGIBLE';

export type RuleId = string;

export type SimpleFlag = boolean | string;

export type JSONFlag = object;

export type FlagWithEvaluationDetails = {
  value: boolean | string | object;
  explanation: {
    reason: Reason;
    ruleId?: RuleId;
  };
  [key: string]: any;
};

export type AnyFlag = SimpleFlag | FlagWithEvaluationDetails | JSONFlag;

export type Flags = {
  [flagName: string]: AnyFlag;
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
    flag: AnyFlag,
    trackExposure: (flagKey: string, flag: FlagWithEvaluationDetails) => void,
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
