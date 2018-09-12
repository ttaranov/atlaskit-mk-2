import { Flag, DarkFeature } from './types';

import { isBoolean, isObject } from './lib';

export default class UntrackedFlag implements Flag {
  flagKey: string;
  value: string | boolean | object;

  constructor(flagKey: string, flag: DarkFeature) {
    this.flagKey = flagKey;
    this.value = flag;
  }

  getBooleanValue(options: {
    default: boolean;
    shouldTrackExposureEvent?: boolean;
  }): boolean {
    if (!isBoolean(this.value)) {
      return options.default;
    }

    return this.value as boolean;
  }

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    shouldTrackExposureEvent?: boolean;
  }): string {
    if (isBoolean(this.value)) {
      return options.default;
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
