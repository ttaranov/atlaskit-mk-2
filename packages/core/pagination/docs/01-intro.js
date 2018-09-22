// @flow
import React from 'react';
import { md, Example, Props, code } from '@atlaskit/docs';

export default md`

  ${(
    <Example
      Component={require('../examples/01-basic').default}
      title="Basic example"
      source={require('!!raw-loader!../examples/01-basic')}
    />
  )}
`;
