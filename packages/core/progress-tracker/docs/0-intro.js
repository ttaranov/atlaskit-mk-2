// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  The progress tracker is used to display the steps and progress through a journey.

  The tracker is most commonly used for the focus task pattern.

  The default visited links support href and onClick passed through stage data.

  ${(
    <Example
      packageName="@atlaskit/progress-tracker"
      Component={require('../examples/basic').default}
      source={require('!!raw-loader!../examples/basic')}
      title="Basic Usage with Default Link"
    />
  )}

  They can be replaced with a custom component which will receieve stage data as a prop.

  ${(
    <Example
      packageName="@atlaskit/progress-tracker"
      Component={require('../examples/custom').default}
      source={require('!!raw-loader!../examples/custom')}
      title="Custom Usage with React Router Link"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/ProgressTracker')}
    />
  )}
`;
