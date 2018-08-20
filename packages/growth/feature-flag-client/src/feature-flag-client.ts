import * as has from 'lodash.has';

function isBoolean(value) {
  return value !== null && typeof value === 'boolean';
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

function isString(value) {
  return value !== null && typeof value === 'string';
}

export default class FrontendFeatureFlagClient {
  triggerAnalytics: Function;
  triggeredEvents: {};
  flags: {} | null;
  uninitialisedFlagsEventName: string;
  reportedUnitialisedFlags: boolean;

  /**
   * constructor for the FrontendFeatureFlagClient
   * @param {Object} clientParams - object containing all required information to initalise the client
   * @param {Function} clientParams.triggerAnalytics - function to dispatch analytic events. Call signature should
   * accept an analytic event object which looks like: {name: 'eventName', data: {variationKey: 'variationName'}}.
   * @param {(Object | String | null)} clientParams.flags - JSON blob of all feature flags. Key = feature flag name.
   * Value = feature flag value.
   * @param {string} clientParams.uninitialisedFlagsEventName - String value for the name of the analytic event to
   * be triggered when this client is accessed prior to having it's flags initialised.
   * @example
   * new FrontendFeatureFlagClient({
   *     triggerAnalytics: (event) => AJS.trigger('analytics', event),
   *     flags: {"ff1.boolean": true, "ff2.string": "variation.name", "ff3.json":{}},
   *     uninitialisedFlagsEventName: 'jira.frontend.fe.feature.flag.client.flags.not.initialised'
   * }
   */
  constructor({
    triggerAnalytics,
    flags,
    uninitialisedFlagsEventName,
  }: {
    triggerAnalytics: Function;
    flags: {} | string | null;
    uninitialisedFlagsEventName: string;
  }) {
    this.triggerAnalytics = triggerAnalytics;
    this.triggeredEvents = {};
    this.setFlags(flags);
    this.uninitialisedFlagsEventName = uninitialisedFlagsEventName;
    this.reportedUnitialisedFlags = false;
  }

  /**
   * Sets the flags after parsing them if the input is a string
   * @param {(Object | string | null)} flags - object or string of flags
   */
  setFlags(flags: {} | string | null) {
    if (typeof flags === 'string') {
      this.flags = JSON.parse(flags);
    } else if (isObject(flags) || flags === null) {
      this.flags = flags;
    } else {
      throw new Error('flags is not a string or object');
    }
  }

  /**
   * Returns true if `flags` is not null, otherwise returns false, logs a console warning and triggers an analytic
   * error event
   * @returns {(boolean | null)} true if `flags` is not null, otherwise false
   */
  isFlagsSet() {
    if (this.flags === null) {
      // @ts-ignore
      if (process.env.NODE_ENV !== 'production') {
        // tslint:disable-next-line:no-console
        console.warn(
          'FrontendFeatureFlagClient is being accessed prior to having flags initialised',
        );
      }
      if (!this.reportedUnitialisedFlags) {
        // Only report via analytics this problem once per page load
        this.triggerAnalytics({ name: this.uninitialisedFlagsEventName });
        this.reportedUnitialisedFlags = true;
      }
      return false;
    }
    return true;
  }

  /**
   * Returns the name of the variation that a feature flag is set to.
   * N.B. Analytic events are only triggered for JSON flags which have a `variationValue` attribute set.
   * @param {string} flagKey - name of the feature flag
   * @param {boolean} shouldTrigger - whether an analytic event should be fired. Defaults to true.
   * @returns {(string | null)} name of the variation OR null if the flag does not exist.
   */
  getVariantValue(flagKey: string, shouldTrigger: boolean = true) {
    if (this.isFlagsSet() && this.flags && has(this.flags, flagKey)) {
      const value = this.flags[flagKey];
      if (isBoolean(value) || isString(value)) {
        return value;
      } else if (has(value, 'targetingRuleKey') && has(value, 'variantValue')) {
        const targetingRuleKey = value.targetingRuleKey;
        const variantValue = value.variantValue;
        if (
          targetingRuleKey !== null &&
          variantValue !== null &&
          shouldTrigger
        ) {
          this.triggerEvent(flagKey, targetingRuleKey, variantValue);
        }
        return variantValue;
      }
    }
    return null;
  }

  /**
   * Checks if a variation is enabled
   * For boolean flags: will only return true if the flag is set to `true` - variantValue passed in is ignored
   * @param {string} flagKey - name of the feature flag
   * @param {(string | boolean)} expectedValue - name of the variation to be checked
   * @param {boolean} shouldTrigger - whether an analytic event should be fired. Defaults to true.
   * @returns {boolean} true if the variation is enabled OR false if the variation is not enabled
   */
  isVariationEnabled(
    flagKey: string,
    expectedValue: string | boolean,
    shouldTrigger: boolean = true,
  ) {
    if (this.isFlagsSet() && this.flags) {
      const value = this.flags[flagKey];
      if (isBoolean(value)) {
        return this.getVariantValue(flagKey, shouldTrigger);
      }
      const variantValue = this.getVariantValue(flagKey, shouldTrigger);
      if (isString(variantValue)) {
        return expectedValue === variantValue;
      } else if (isBoolean(variantValue)) {
        return variantValue;
      }
    }
    return false;
  }

  /**
   * Triggers an analytic event with details of the triggered feature flag - limited to once per page load
   * @param {string} flagKey - name of the feature flag
   * @param {string} targetingRuleKey - key for the targeting rule (provided either by LaunchDarkly or the variant
   * payload)
   * @param {(string | boolean)} variantValue - name of the variation the feature flag is set to
   */
  triggerEvent(
    flagKey: string,
    targetingRuleKey: string,
    variantValue: string | boolean,
  ) {
    if (
      !isString(flagKey) ||
      !isString(targetingRuleKey) ||
      (!isString(variantValue) && !isBoolean(variantValue)) ||
      this.triggeredEvents[flagKey]
    ) {
      return;
    }
    const event = {
      name: `variant.exposure.${flagKey}`,
      data: {
        targetingRuleKey,
        variantValue,
      },
    };
    this.triggerAnalytics(event);
    this.triggeredEvents[flagKey] = true;
  }
}
