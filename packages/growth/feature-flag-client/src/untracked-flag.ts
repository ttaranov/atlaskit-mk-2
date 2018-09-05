import { Flag, DarkFeature } from './types';

import { isBoolean } from './lib';

export default class UntrackedFlag implements Flag {
  flagKey: string;
  value: string | boolean;

  constructor(flagKey: string, flag: DarkFeature) {
    this.flagKey = flagKey;
    this.value = flag;
  }

  getBooleanValue(options: {
    default: boolean;
    trackExposureEvent?: boolean;
  }): boolean {
    if (!isBoolean(this.value)) {
      return options.default;
    }

    return this.value as boolean;
  }

  getVariantValue(options: {
    default: string;
    oneOf: string[];
    trackExposureEvent?: boolean;
  }): string {
    if (isBoolean(this.value)) {
      return options.default;
    }

    return this.value as string;
  }

  getJSONFlag() {
    return {};
  }
}
