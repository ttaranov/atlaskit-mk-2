import FeatureFlagClient from '../../client';

describe('Feature Flag Client', () => {
  describe('bootstrap', () => {
    test('should throw if no analytics handler is given', () => {
      expect(() => new FeatureFlagClient({} as any)).toThrowError(
        'Feature Flag Client: Missing analyticsHandler',
      );
    });

    test('should allow to bootstrap with flags', () => {
      const client = new FeatureFlagClient({
        analyticsHandler: jest.fn(),
        flags: {
          'my.flag': false,
        },
      });

      expect(client.getBooleanValue('my.flag', { default: true })).toBe(false);
    });

    test('should allow to set flags later', () => {
      const client = new FeatureFlagClient({
        analyticsHandler: jest.fn(),
        flags: {
          'my.flag': false,
        },
      });

      client.setFlags({
        'my.first.flag': true,
      });

      client.setFlags({
        'my.second.flag': {
          reason: 'RULE_MATCH',
          ruleId: '111-bbbbb-ccc',
          value: 'experiment',
        },
      });

      expect(client.getBooleanValue('my.flag', { default: true })).toBe(false);
      expect(client.getBooleanValue('my.first.flag', { default: false })).toBe(
        true,
      );
      expect(
        client.getVariantValue('my.second.flag', {
          default: 'control',
          oneOf: ['control', 'experiment'],
        }),
      ).toBe('experiment');
    });
  });

  describe('clear', () => {
    test('should remove all flags', () => {
      const client = new FeatureFlagClient({
        analyticsHandler: jest.fn(),
        flags: {
          'my.flag': false,
        },
      });

      expect(client.getBooleanValue('my.flag', { default: true })).toBe(false);

      client.clear();

      expect(client.getBooleanValue('my.flag', { default: true })).toBe(true);
    });
  });

  describe('getters', () => {
    let client;
    let analyticsHandler;

    beforeEach(() => {
      analyticsHandler = jest.fn();
      client = new FeatureFlagClient({
        analyticsHandler,
        flags: {
          'my.variation.flag': {
            reason: 'RULE_MATCH',
            ruleId: '111-bbbbb-ccc',
            value: 'experiment',
          },
          'my.variation.a': {
            reason: 'RULE_MATCH',
            ruleId: '111-bbbbb-ccc',
            value: 'variation-a',
          },
          'my.experiment': {
            reason: 'RULE_MATCH',
            ruleId: '111-bbbbb-ccc',
            value: 'experiment',
          },
          'my.boolean.flag': false,
          'my.detailed.boolean.flag': {
            reason: 'RULE_MATCH',
            ruleId: '111-bbbbb-ccc',
            value: false,
          },
        },
      });
    });

    afterEach(() => {
      client.clear();
    });

    describe('getBooleanValue', () => {
      test('should throw if called without default', () => {
        expect(() =>
          expect(client.getBooleanValue('my.flag', {} as any)),
        ).toThrow('getBooleanValue: Missing default');
      });

      test('should return default if flag is not set', () => {
        expect(client.getBooleanValue('my.flag', { default: true })).toBe(true);
      });

      test('should return default if flag is not boolean', () => {
        expect(
          client.getBooleanValue('my.variation.flag', { default: true }),
        ).toBe(true);
      });

      test('should return the right value when the flag is boolean', () => {
        expect(
          client.getBooleanValue('my.boolean.flag', { default: true }),
        ).toBe(false);
      });

      test('should not fire the exposure event if the flag does not contain evaluation details (short format / dark feature)', () => {
        expect(
          client.getBooleanValue('my.boolean.flag', { default: true }),
        ).toBe(false);
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should fire the exposure event if the flag contains evaluation details (long format / feature flag)', () => {
        expect(
          client.getBooleanValue('my.detailed.boolean.flag', { default: true }),
        ).toBe(false);
        expect(analyticsHandler).toHaveBeenCalledTimes(1);
      });

      test('should not fire the exposure event if trackExposureEvent is false', () => {
        expect(
          client.getBooleanValue('my.detailed.boolean.flag', {
            default: true,
            trackExposureEvent: false,
          }),
        ).toBe(false);
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });
    });

    describe('getVariantValue', () => {
      test('should throw if called without default', () => {
        expect(() =>
          client.getVariantValue('my.flag', {
            oneOf: ['control', 'experiment'],
          } as any),
        ).toThrow('getVariantValue: Missing default');
      });

      test('should throw if called without oneOf', () => {
        expect(() =>
          client.getVariantValue('my.flag', { default: 'control' } as any),
        ).toThrow('getVariantValue: Missing oneOf');
      });

      test('should return default if flag is not set, and not fire exposure event', () => {
        expect(
          client.getVariantValue('my.flag', {
            default: 'control',
            oneOf: ['control', 'experiment'],
          }),
        ).toBe('control');
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should return default if flag is boolean, and not fire exposure event', () => {
        expect(
          client.getVariantValue('my.flag', {
            default: 'control',
            oneOf: ['control', 'experiment'],
          }),
        ).toBe('control');
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should return default if flag is not listed as oneOf, and not fire exposure event', () => {
        expect(
          client.getVariantValue('my.variation.a', {
            default: 'control',
            oneOf: ['control', 'experiment'],
          }),
        ).toBe('control');
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });

      test('should return the right value if flag is listed as oneOf, and fire exposure event', () => {
        expect(
          client.getVariantValue('my.experiment', {
            default: 'control',
            oneOf: ['control', 'experiment'],
          }),
        ).toBe('experiment');
        expect(analyticsHandler).toHaveBeenCalledTimes(1);
      });

      test('should not fire exposure event if trackExposureEvent is false', () => {
        expect(
          client.getVariantValue('my.experiment', {
            default: 'control',
            oneOf: ['control', 'experiment'],
            trackExposureEvent: false,
          }),
        ).toBe('experiment');
        expect(analyticsHandler).toHaveBeenCalledTimes(0);
      });
    });
  });
});
