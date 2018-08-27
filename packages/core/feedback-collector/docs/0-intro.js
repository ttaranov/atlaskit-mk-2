// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage appearance="warning">
    <p>
      <strong>
        Note: @atlaskit/feedback-collector is currently a developer preview.
      </strong>
    </p>
    <p>
      Please experiment with and test this package, but be aware that the API
      may change at any time. Use at your own risk, preferrably not in
      production.
    </p>
  </SectionMessage>
)}

Feedback collector is a form component that collects customer feedback across Atlassian products.

${(
  <Example
    Component={require('../examples/02-button').default}
    title="As a button"
    source={require('!!raw-loader!../examples/02-button')}
  />
)}

${(
  <Props
    heading="Props"
    props={require('!!extract-react-types-loader!../src/components/FeedbackCollector')}
  />
)}

`;
