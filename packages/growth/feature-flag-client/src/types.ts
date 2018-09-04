export type Reason =
  | 'OFF'
  | 'FALLTHROUGH'
  | 'RULE_MATCH'
  | 'TARGET_MATCH'
  | 'INELIGIBLE';

export type RuleId = string;

export type DarkFeature = boolean;

export type FeatureFlag = {
  reason: Reason;
  ruleId?: RuleId;
  value: boolean | string | object;
  [key: string]: any;
};

export type Flags = {
  [flagName: string]: DarkFeature | FeatureFlag;
};

export type AnalyticsHandler = (flag: FeatureFlag) => void;

export type ClientOptions = {
  flags?: Flags;
  analyticsHandler: AnalyticsHandler;
};

export type ParsedFlag = {
  type: 'feature-flag' | 'dark-feature';
  value: boolean | string;
  flag: DarkFeature | FeatureFlag;
};
