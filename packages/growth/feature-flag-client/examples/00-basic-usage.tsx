import * as React from 'react';
import FeatureFlagClient from '../src/index';

const myAnalyticsClient = {
  sendTrackEvent(event) {
    console.log('Sending exposure event', event);
  },
};

const client = new FeatureFlagClient({
  analyticsClient: myAnalyticsClient,
  flags: {
    'my.experiment': {
      value: 'experiment',
      trackEvents: true,
      explanation: {
        reason: 'RULE_MATCH',
        ruleUUID: '111-bbbbb-ccc',
      },
    },
    'my.boolean.flag': false,
    'my.json.flag': {
      value: {
        nav: 'blue',
        footer: 'black',
      },
      trackEvents: false,
      explanation: {
        reason: 'RULE_MATCH',
        ruleUUID: '111-bbbbb-ccc',
      },
    },
    'my.detailed.boolean.flag': {
      value: false,
      trackEvents: true,
      explanation: {
        reason: 'RULE_MATCH',
        ruleUUID: '111-bbbbb-ccc',
      },
    },
  },
});

function Demo({ str, result }) {
  return (
    <div>
      <pre
        style={{
          padding: 5,
          display: 'block',
          background: '#000',
          color: '#fff',
        }}
      >
        {str}
      </pre>
      {result !== '' && (
        <pre
          style={{
            marginTop: 5,
            padding: 5,
            display: 'block',
            background: '#eee',
          }}
        >
          >> {JSON.stringify(result)}
        </pre>
      )}
    </div>
  );
}

export default () => (
  <div>
    <h2>Feature flag client</h2>

    <Demo
      str={`const client = new FeatureFlagClient({
  analyticsClient: myAnalyticsClient,
  flags: {
    'my.experiment': {
      value: 'experiment',
      trackEvents: true,
      explanation: {
        reason: 'RULE_MATCH',
        ruleUUID: '111-bbbbb-ccc',
      },
    },
    'my.boolean.flag': false,
    'my.json.flag': {
      value: {
        nav: 'blue',
        footer: 'black'
      },
      trackEvents: false,
      explanation: {
        reason: 'RULE_MATCH',
        ruleUUID: '111-bbbbb-ccc',
      },
    },
    'my.detailed.boolean.flag': {
      value: false,
      trackEvents: true,
      explanation: {
        reason: 'RULE_MATCH',
        ruleUUID: '111-bbbbb-ccc',
      },
    },
  },
});`}
      result=""
    />
    <hr />
    <Demo
      str={`client.getVariantValue('my.experiment', {
  default: 'control',
  oneOf: ['control', 'experiment']
}) === 'experiment';`}
      result={client.getVariantValue('my.experiment', {
        default: 'control',
        oneOf: ['control', 'experiment'],
      })}
    />
    <hr />
    <Demo
      str={`client.getBooleanValue('my.boolean.flag', { default: true })`}
      result={client.getBooleanValue('my.boolean.flag', { default: true })}
    />
    <hr />
    <Demo
      str={`JSON.stringify(client.getJSONValue('my.json.flag'))`}
      result={JSON.stringify(client.getJSONValue('my.json.flag'))}
    />
    <hr />
    <Demo
      str={`client.getBooleanValue('my.detailed.boolean.flag', { default: true })`}
      result={client.getBooleanValue('my.detailed.boolean.flag', {
        default: true,
      })}
    />
  </div>
);
