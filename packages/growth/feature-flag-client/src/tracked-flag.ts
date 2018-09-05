import { FeatureFlagType, Flag } from './types';
import { isBoolean, isObject, isOneOf } from './lib';

export default class TrackedFlag implements Flag {
  flagKey: string;
  flag: FeatureFlagType;
  value: string | boolean | object;
  trackExposure: (flagKey: string, flag: FeatureFlagType) => void;

  constructor(
    flagKey: string,
    flag: FeatureFlagType,
    trackExposure: (flagKey: string, flag: FeatureFlagType) => void,
  ) {
    this.flagKey = flagKey;
    this.value = flag.value;
    this.trackExposure = trackExposure;
    this.flag = flag;
  }

  getBooleanValue(options: {
    default: boolean;
    trackExposureEvent?: boolean;
  }): boolean {
    if (!isBoolean(this.value)) {
      return options.default;
    }

    if (options.trackExposureEvent && this.flag.trackEvents) {
      this.trackExposure(this.flagKey, this.flag);
    }

    return this.value as boolean;
  }

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    trackExposureEvent?: boolean;
  }): string {
    if (!isOneOf(this.value as string, options.oneOf)) {
      return options.default;
    }

    if (options.trackExposureEvent && this.flag.trackEvents) {
      this.trackExposure(this.flagKey, this.flag);
    }

    return this.value as string;
  }

  getJSONFlag(): object {
    if (!isObject(this.value)) {
      return {};
    }

    return this.value as object;
  }
}
