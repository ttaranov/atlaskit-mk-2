import FrontendFeatureFlagClient from '../../feature-flag-client';

const sampleFlagsJson = {
  'experiment.boolean.false': false,
  'experiment.boolean.true': true,
  'experiment.string.control': 'control',
  'experiment.pojo.valid': {
    targetingRuleKey: 'eval.experiment',
    variantValue: 'variation-1',
    hasExtraContent: true,
  },
  'experiment.pojo.with.null.targetingRuleKey': {
    targetingRuleKey: null,
    variantValue: 'variation-1',
  },
  'experiment.pojo.with.null.variantValue': {
    targetingRuleKey: 'eval.experiment',
    variantValue: null,
  },
  'experiment.pojo.with.boolean.false': {
    targetingRuleKey: 'eval.experiment',
    variantValue: false,
    hasExtraContent: true,
  },
  'experiment.pojo.with.boolean.true': {
    targetingRuleKey: 'eval.experiment',
    variantValue: true,
    hasExtraContent: true,
  },
  'experiment.pojo.without.targetingRuleKey': {
    variantValue: 'variation-1',
  },
  'experiment.pojo.without.variantValue': {
    targetingRuleKey: 'eval.experiment',
  },
};

const errorEventString = 'something.went.wrong';
const errorEvent = { name: errorEventString };

const setupFrontendFeatureFlagClient = flagsJson =>
  new FrontendFeatureFlagClient({
    triggerAnalytics: jest.fn(),
    flags: flagsJson,
    uninitialisedFlagsEventName: errorEventString,
  });

describe('Frontend feature flag client', () => {
  describe('#constructor', () => {
    test('should set flags when passed valid JSON object', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      expect(frontendFeatureFlagClient.flags).toEqual(sampleFlagsJson);
    });
  });

  describe('#isFlagsSet', () => {
    test('should return null if `flags` is not initialised and triggers an error event', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(null);

      expect(
        frontendFeatureFlagClient.getVariantValue('experiment.string.control'),
      ).toBe(null);
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        1,
      );
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledWith(
        errorEvent,
      );
    });
  });

  describe('#getVariantValue', () => {
    test('should return the correct variation', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );

      expect(
        frontendFeatureFlagClient.getVariantValue('experiment.boolean.false'),
      ).toBe(false);
      expect(
        frontendFeatureFlagClient.getVariantValue('experiment.boolean.true'),
      ).toBe(true);
      expect(
        frontendFeatureFlagClient.getVariantValue('experiment.string.control'),
      ).toBe('control');
      expect(
        frontendFeatureFlagClient.getVariantValue('experiment.pojo.valid'),
      ).toBe('variation-1');
      expect(
        frontendFeatureFlagClient.getVariantValue(
          'experiment.pojo.with.null.targetingRuleKey',
        ),
      ).toBe('variation-1');
      expect(
        frontendFeatureFlagClient.getVariantValue(
          'experiment.pojo.with.null.variantValue',
        ),
      ).toBe(null);
      expect(
        frontendFeatureFlagClient.getVariantValue(
          'experiment.pojo.with.boolean.false',
        ),
      ).toBe(false);
      expect(
        frontendFeatureFlagClient.getVariantValue(
          'experiment.pojo.with.boolean.true',
        ),
      ).toBe(true);
      // Expect null for JSON objects without a `targetingRuleKey` attribute
      expect(
        frontendFeatureFlagClient.getVariantValue(
          'experiment.pojo.without.targetingRuleKey',
        ),
      ).toBe(null);
      // Expect null for JSON objects without a `variantValue` attribute
      expect(
        frontendFeatureFlagClient.getVariantValue(
          'experiment.pojo.without.variantValue',
        ),
      ).toBe(null);
    });

    test('should return null if the flag does not exist', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      expect(frontendFeatureFlagClient.getVariantValue('experiment.9999')).toBe(
        null,
      );
    });

    test('should call triggerAnalytics by default if json flag is valid', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      frontendFeatureFlagClient.getVariantValue('experiment.pojo.valid');
      const event = {
        name: 'variant.exposure.experiment.pojo.valid',
        data: {
          targetingRuleKey: 'eval.experiment',
          variantValue: 'variation-1',
        },
      };
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        1,
      );
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledWith(
        event,
      );
    });

    test('should call triggerAnalytics by default if json flag has variationValue set to false', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      frontendFeatureFlagClient.getVariantValue(
        'experiment.pojo.with.boolean.false',
      );
      const event = {
        name: 'variant.exposure.experiment.pojo.with.boolean.false',
        data: {
          targetingRuleKey: 'eval.experiment',
          variantValue: false,
        },
      };
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        1,
      );
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledWith(
        event,
      );
    });

    test('should not call triggerAnalytics if shouldTrigger is set to false', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      frontendFeatureFlagClient.getVariantValue('experiment.pojo.valid', false);
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        0,
      );
    });

    test('should not call triggerAnalytics if json flag `targetingRuleKey` attribute is set to null', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      frontendFeatureFlagClient.getVariantValue(
        'experiment.pojo.with.null.targetingRuleKey',
      );
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        0,
      );
    });

    test('should not call triggerAnalytics if json flag is missing `targetingRuleKey` attribute', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      frontendFeatureFlagClient.getVariantValue(
        'experiment.pojo.without.targetingRuleKey',
      );
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        0,
      );
    });

    test('should not call triggerAnalytics if json flag `variantValue` attribute is set to null', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      frontendFeatureFlagClient.getVariantValue(
        'experiment.pojo.with.null.variantValue',
      );
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        0,
      );
    });

    test('should not call triggerAnalytics if json flag is missing `variantValue` attribute', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      frontendFeatureFlagClient.getVariantValue(
        'experiment.pojo.without.variantValue',
      );
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        0,
      );
    });

    test('should not call triggerAnalytics for Boolean flags', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      frontendFeatureFlagClient.getVariantValue('experiment.boolean.false');
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        0,
      );
    });

    test('should not call triggerAnalytics for String flags', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      frontendFeatureFlagClient.getVariantValue('experiment.string.control');
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        0,
      );
    });

    test('should not call triggerAnalytics if feature flag does not exist', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      frontendFeatureFlagClient.getVariantValue('experiment.9999');
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        0,
      );
    });
  });

  describe('#isVariationEnabled', () => {
    test('should return true for enabled boolean flag', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.boolean.true',
          false,
        ),
      ).toBe(true);
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.boolean.true',
          true,
        ),
      ).toBe(true);
    });

    test('should return false for disabled boolean flag', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.boolean.false',
          false,
        ),
      ).toBe(false);
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.boolean.false',
          true,
        ),
      ).toBe(false);
    });

    test('should return true if flag is set to the specified variation', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.string.control',
          'control',
        ),
      ).toBe(true);
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.pojo.valid',
          'variation-1',
        ),
      ).toBe(true);
    });

    test('should return false if flag is not set to the expected variation', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.string.control',
          'variation-1',
        ),
      ).toBe(false);
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.pojo.valid',
          'control',
        ),
      ).toBe(false);
    });

    test('should return false if json flag is missing `variantValue` attribute', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.pojo.without.variantValue',
          'control',
        ),
      ).toBe(false);
    });

    test('should return false if json flag has `variantValue` set to false', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.pojo.with.boolean.false',
          false,
        ),
      ).toBe(false);
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.pojo.with.boolean.false',
          true,
        ),
      ).toBe(false);
    });

    test('should return true if json flag has `variantValue` set to true', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.pojo.with.boolean.true',
          false,
        ),
      ).toBe(true);
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.pojo.with.boolean.true',
          true,
        ),
      ).toBe(true);
    });

    test('should return false if the flag does not exist', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.9999',
          'control',
        ),
      ).toBe(false);
    });

    test('should return false if the flags are not initialised and triggers an error event', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(null);
      expect(
        frontendFeatureFlagClient.isVariationEnabled(
          'experiment.string.control',
          'control',
        ),
      ).toBe(false);
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        1,
      );
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledWith(
        errorEvent,
      );
    });
  });

  describe('#triggerEvent', () => {
    test('should fire the correct event for a valid json flag', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      const experimentKey = 'experiment.pojo.valid';
      const event = {
        name: 'variant.exposure.experiment.pojo.valid',
        data: {
          targetingRuleKey: 'eval.experiment',
          variantValue: 'variation-1',
        },
      };
      frontendFeatureFlagClient.triggerEvent(
        experimentKey,
        sampleFlagsJson[experimentKey].targetingRuleKey,
        sampleFlagsJson[experimentKey].variantValue,
      );
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        1,
      );
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledWith(
        event,
      );
    });
  });

  describe('#fireExposureEvent', () => {
    test('should fire the exposure event "once"', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );
      const experimentKey = 'experiment.pojo.valid';

      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        1,
      );

      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledWith({
        name: 'variant.exposure.experiment.pojo.valid',
        data: {
          targetingRuleKey: 'eval.experiment',
          variantValue: 'variation-1',
        },
      });

      frontendFeatureFlagClient.fireExposureEvent(experimentKey);

      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        1,
      );
    });

    test('should not fire the exposure event if a flag does not contains evaluation details', () => {
      const frontendFeatureFlagClient = setupFrontendFeatureFlagClient(
        sampleFlagsJson,
      );

      frontendFeatureFlagClient.fireExposureEvent('experiment.boolean.false');
      expect(frontendFeatureFlagClient.triggerAnalytics).toHaveBeenCalledTimes(
        0,
      );
    });
  });
});
