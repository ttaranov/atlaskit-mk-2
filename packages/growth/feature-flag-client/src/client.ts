import { Flags, ExposureEvent, FlagShape } from './types';
import {
  isObject,
  enforceAttributes,
  isFlagWithEvaluationDetails,
  isSimpleFlag,
  validateFlags,
} from './lib';

import TrackedFlag from './tracked-flag';
import UntrackedFlag from './untracked-flag';

export default class FeatureFlagClient {
  flags: Readonly<Flags> = {};
  trackedFlags: { [flagKey: string]: boolean } = {};
  analyticsHandler: (event: ExposureEvent) => void;

  constructor(options: {
    flags?: Flags;
    analyticsHandler: (event: ExposureEvent) => void;
  }) {
    const { flags, analyticsHandler } = options;

    enforceAttributes(options, ['analyticsHandler'], 'Feature Flag Client');

    this.setFlags(flags || {});
    this.setAnalyticsHandler(analyticsHandler);
  }

  setFlags(flags: Flags) {
    if (!isObject(flags)) {
      return;
    }

    // @ts-ignore
    if (process.env !== 'production') {
      validateFlags(flags);
    }

    this.flags = {
      ...this.flags,
      ...flags,
    };
  }

  setAnalyticsHandler(analyticsHandler) {
    this.analyticsHandler = analyticsHandler;
  }

  getFlag(flagKey: string): TrackedFlag | UntrackedFlag | null {
    const flag = this.flags[flagKey];

    if (isFlagWithEvaluationDetails(flag)) {
      return new TrackedFlag(flagKey, flag, this.trackExposure);
    }

    if (isSimpleFlag(flag)) {
      return new UntrackedFlag(flagKey, flag);
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
      shouldTrackExposureEvent?: boolean;
    },
  ): boolean {
    enforceAttributes(options, ['default'], 'getBooleanValue');

    const getterOptions = {
      shouldTrackExposureEvent: true,
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
      shouldTrackExposureEvent?: boolean;
    },
  ): string {
    enforceAttributes(options, ['default', 'oneOf'], 'getVariantValue');

    const getterOptions = {
      shouldTrackExposureEvent: true,
      ...options,
    };

    const flag = this.getFlag(flagKey);

    if (!flag) {
      return options.default;
    }

    return flag.getVariantValue(getterOptions) as string;
  }

  getJSONValue(flagKey: string): object {
    const flag = this.getFlag(flagKey);

    if (!flag) {
      return {};
    }

    return flag.getJSONValue();
  }

  trackExposure = (flagKey: string, flag: FlagShape) => {
    if (
      this.trackedFlags[flagKey] ||
      !flag ||
      !flag.explanation ||
      !this.analyticsHandler
    ) {
      return;
    }

    this.analyticsHandler({
      action: 'exposed',
      actionSubject: 'feature',
      attributes: {
        flagKey,
        reason: flag.explanation.kind,
        ruleId: flag.explanation.ruleId,
        value: flag.value,
      },
      source: '@atlaskit/feature-flag-client',
    });

    this.trackedFlags[flagKey] = true;
  };
}
