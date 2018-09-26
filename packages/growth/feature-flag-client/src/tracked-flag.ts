import { FlagWithEvaluationDetails, Flag } from './types';
import { isBoolean, isObject, isOneOf } from './lib';

export default class TrackedFlag implements Flag {
  flagKey: string;
  flag: FlagWithEvaluationDetails;
  value: string | boolean | object;
  trackExposure: (flagKey: string, flag: FlagWithEvaluationDetails) => void;

  constructor(
    flagKey: string,
    flag: FlagWithEvaluationDetails,
    trackExposure: (flagKey: string, flag: FlagWithEvaluationDetails) => void,
  ) {
    this.flagKey = flagKey;
    this.value = flag.value;
    this.trackExposure = trackExposure;
    this.flag = flag;
  }

  getBooleanValue(options: {
    default: boolean;
    shouldTrackExposureEvent?: boolean;
  }): boolean {
    if (!isBoolean(this.value)) {
      return options.default;
    }

    if (options.shouldTrackExposureEvent) {
      this.trackExposure(this.flagKey, this.flag);
    }

    return this.value as boolean;
  }

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
  }): string {
    if (!isOneOf(this.value as string, options.oneOf)) {
      return options.default;
    }
    if (options.shouldTrackExposureEvent) {
      this.trackExposure(this.flagKey, this.flag);
    }

    return this.value as string;
  }

  getJSONValue(): object {
    if (!isObject(this.value)) {
      return {};
    }

    return this.value as object;
  }
}
