import { Flag, FlagShape } from './types';

import { isBoolean, isObject, isOneOf, isString } from './lib';

export default class UntrackedFlag implements Flag {
  flagKey: string;
  value: string | boolean | object;

  constructor(flagKey: string, flag: FlagShape) {
    this.flagKey = flagKey;
    this.value = flag.value;
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
    if (
      !isString(this.value) ||
      !isOneOf(this.value as string, options.oneOf)
    ) {
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
