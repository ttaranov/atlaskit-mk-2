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
    analyticsClient: myAnalyticsClient,
    flags: {
      'my.experiment': {
        reason: 'RULE_MATCH',
        ruleId: '111-bbbbb-ccc',
        value: 'experiment',
      },
      'my.detailed.boolean.flag': {
        reason: 'RULE_MATCH',
        ruleId: '111-bbbbb-ccc',
        value: false,
      },
    },
  });

  // flag set, returns real value
  client.getBooleanValue('my.detailed.boolean.flag', { default: true }); // > false

  // flag set, returns real value
  client.getVariantValue('my.experiment', {
    default: 'control',
    oneOf: ['control', 'experiment'],
  }); // > experiment

  // flag unset, returns default value
  client.getBooleanValue('my.unlisted.boolean.flag', { default: false }); // > false

  // flag value doesn't match expected, returns default
  client.getVariantValue('my.experiment', {
    default: 'control',
    oneOf: ['control', 'variant-a'],
  }); // > control

  // do not send exposure event (trackExposureEvent: false)
  client.getBooleanValue('my.detailed.boolean.flag', {
    default: true,
    trackExposureEvent: false,
  });
  ~~~
`;
