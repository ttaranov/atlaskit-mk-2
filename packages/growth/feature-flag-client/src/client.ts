import {
  DarkFeature,
  FeatureFlag,
  Flags,
  AnalyticsHandler,
  ClientOptions,
  ParsedFlag,
} from './types';
import {
  isObject,
  isBoolean,
  isOneOf,
  enforceAttributes,
  parseFlag,
} from './lib';

export default class FeatureFlagClient {
  flags: Readonly<Flags> = {};

  trackedFlags: { [flagKey: string]: boolean } = {};
  analyticsHandler: AnalyticsHandler;

  constructor(options: ClientOptions) {
    const { flags, analyticsHandler } = options;

    enforceAttributes(options, ['analyticsHandler'], 'Feature Flag Client');

    this.analyticsHandler = analyticsHandler;
    this.setFlags(flags || {});
  }

  setFlags(flags: Flags) {
    if (!isObject(flags)) {
      return;
    }

    this.flags = {
      ...this.flags,
      ...flags,
    };
  }

  getFlag(flagKey: string): ParsedFlag | null {
    const flag = this.flags[flagKey];

    return parseFlag(flag);
  }

  clear() {
    this.flags = {};
    this.trackedFlags = {};
  }

  getBooleanValue(
    flagKey,
    options: {
      default: boolean;
      trackExposureEvent?: boolean;
    },
  ): boolean {
    enforceAttributes(options, ['default'], 'getBooleanValue');

    const getterOptions = {
      trackExposureEvent: true,
      ...options,
    };

    const flag = this.getFlag(flagKey);

    if (!flag || !isBoolean(flag.value)) {
      return getterOptions.default;
    }

    if (flag.type === 'dark-feature') {
      return flag.value as DarkFeature;
    }

    if (flag.type === 'feature-flag') {
      if (getterOptions.trackExposureEvent) {
        this.trackExposure(flagKey);
      }

      return flag.value as boolean;
    }

    return getterOptions.default;
  }

  getVariantValue(
    flagKey,
    options: {
      default: string;
      oneOf: string[];
      trackExposureEvent?: boolean;
    },
  ) {
    enforceAttributes(options, ['default', 'oneOf'], 'getVariantValue');

    const getterOptions = {
      trackExposureEvent: true,
      ...options,
    };

    const flag = this.getFlag(flagKey);

    if (!flag || isBoolean(flag.value)) {
      return getterOptions.default;
    }

    if (flag.type === 'feature-flag') {
      if (!isOneOf(flag.value as string, getterOptions.oneOf)) {
        return options.default;
      }

      if (getterOptions.trackExposureEvent) {
        this.trackExposure(flagKey);
      }

      return flag.value;
    }

    return getterOptions.default;
  }

  trackExposure(flagKey: string) {
    if (this.trackedFlags[flagKey]) {
      return;
    }

    const flag = this.flags[flagKey];
    const parsedFlag = parseFlag(flag);

    if (parsedFlag && parsedFlag.type === 'feature-flag') {
      this.analyticsHandler(flag as FeatureFlag);
      this.trackedFlags[flagKey] = true;
    }
  }
}
