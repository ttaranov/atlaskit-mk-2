import { FeatureFlag, Flags, AnalyticsClient, DarkFeature } from './types';
import {
  isObject,
  enforceAttributes,
  isFeatureFlag,
  isDarkFeature,
} from './lib';

import TrackedFlag from './tracked-flag';
import UntrackedFlag from './untracked-flag';

export default class FeatureFlagClient {
  flags: Readonly<Flags> = {};
  trackedFlags: { [flagKey: string]: boolean } = {};
  analyticsClient: AnalyticsClient;

  constructor(options: { flags?: Flags; analyticsClient: AnalyticsClient }) {
    const { flags, analyticsClient } = options;

    enforceAttributes(options, ['analyticsClient'], 'Feature Flag Client');

    this.analyticsClient = analyticsClient;
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

  getFlag(flagKey: string): TrackedFlag | UntrackedFlag | null {
    const flag = this.flags[flagKey];

    if (isFeatureFlag(flag)) {
      return new TrackedFlag(flagKey, flag as FeatureFlag, this.trackExposure);
    }

    if (isDarkFeature(flag)) {
      return new UntrackedFlag(flagKey, flag as DarkFeature);
    }

    return null;
  }

  clear() {
    this.flags = {};
    this.trackedFlags = {};
  }

  getBooleanValue(
    flagKey: string,
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

    if (!flag) {
      return options.default;
    }

    return flag.getBooleanValue(getterOptions);
  }

  getVariantValue(
    flagKey: string,
    options: {
      default: string;
      oneOf: string[];
      trackExposureEvent?: boolean;
    },
  ): string {
    enforceAttributes(options, ['default', 'oneOf'], 'getVariantValue');

    const getterOptions = {
      trackExposureEvent: true,
      ...options,
    };

    const flag = this.getFlag(flagKey);

    if (!flag) {
      return options.default;
    }

    return flag.getVariantValue(getterOptions) as string;
  }

  getJSONFlag(flagKey: string): object {
    const flag = this.getFlag(flagKey);

    if (!flag) {
      return {};
    }

    return flag.getJSONFlag();
  }

  trackExposure = (flagKey: string, flag: FeatureFlag) => {
    if (this.trackedFlags[flagKey] || !flag) {
      return;
    }

    this.analyticsClient.sendTrackEvent({
      action: 'exposed',
      actionSubject: 'feature',
      attributes: {
        reason: flag.explanation.reason,
        ruleUUID: flag.explanation.ruleUUID,
        value: flag.value,
      },
    });

    this.trackedFlags[flagKey] = true;
  };
}
