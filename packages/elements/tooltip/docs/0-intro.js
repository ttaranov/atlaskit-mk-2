// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  A Tooltip.

  ${<Example
    Component={require('../examples/0-basic').default}
    source={require('!!raw-loader!../examples/0-basic')}
  />}

  ${<Props props={require('!!extract-react-types-loader!../src/components/Tooltip')} />}
`;
