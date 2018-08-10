import { md } from '@atlaskit/docs';

export default md`
  # Feature flag client

  This provides a client for evaluating feature flag and firing exposure events.

  ## Installation

  ~~~js
  npm install @atlaskit/feature-flag-client
  # or
  yarn add @atlaskit/feature-flag-client
  ~~~

  ## Using the client

  Use the component in your React app as follows:

  ~~~js
  import FrontendFeatureFlagClient from '@atlaskit/feature-flag-client';

  const client = new FrontendFeatureFlagClient({
    triggerAnalytics: myAnalyticsHandler,
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

  if (client.getVariantValue('experiment.boolean.false')) {
    // skip this
  } else {
    // runs this
  }

  if (client.getVariantValue('experiment.boolean.true')) {
    // run this
  }

  if (client.getVariantValue('experiment.string.control') === 'control') {
    // run this
  }

  if (client.getVariantValue('experiment.pojo.valid') === 'variation-1') {
    // run this
  }
  ~~~
`;
