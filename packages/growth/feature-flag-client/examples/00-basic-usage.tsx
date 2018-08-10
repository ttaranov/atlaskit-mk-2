import * as React from 'react';
import FrontendFeatureFlagClient from '../src/feature-flag-client';

const client = new FrontendFeatureFlagClient({
  triggerAnalytics: event => console.log('fake exposure event', event),
  flags: {
    'experiment.boolean.false': false,
    'experiment.boolean.true': true,
    'experiment.string.control': 'control',
    'experiment.pojo.valid': {
      targetingRuleKey: 'eval.experiment',
      variantValue: 'variation-1',
      hasExtraContent: true,
    },
  },
  uninitialisedFlagsEventName: 'something.went.wrong',
});

client.getVariantValue('experiment.string.control') === 'control';

const getVariantValueWithReactOutput = flag => (
  <p>
    {flag}: {`${client.getVariantValue(flag)}`}
  </p>
);

export default () => (
  <div>
    <h2>Feature flag client</h2>

    <h3>Flags : values</h3>
    {getVariantValueWithReactOutput('experiment.boolean.false')}
    {getVariantValueWithReactOutput('experiment.boolean.true')}
    {getVariantValueWithReactOutput('experiment.string.control')}
    {getVariantValueWithReactOutput('experiment.pojo.valid')}
  </div>
);
