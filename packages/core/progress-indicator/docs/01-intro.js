// @flow

import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  The progress dots are visual indicators used when stepping a user through
  a journey, to allow them to keep track of their progress.

  They are typically accompanied by a carousel or other such UI device.

  ## Examples

  ${(
    <Example
      packageName="@atlaskit/progress-indicator"
      Component={require('../examples/01-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/01-basic')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Dots')}
    />
  )}


`;
