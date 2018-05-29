// @flow

import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  A collection of various formatting components.

  ## Included formatters

  - Max

  ### Max

  ${(
    <Example
      Component={require('../examples/0-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-basic')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Max')}
    />
  )}
`;
