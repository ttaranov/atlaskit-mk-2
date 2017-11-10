// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  The layer manager is used to render React DOM into a new context (aka "Portal").
  This can be used to implement various UI components such as modals.

  ${<Example
    Component={require('../examples/basic').default}
    source={require('!!raw-loader!../examples/basic')}
    title="Basic Usage"
  />}

  ${<Props props={require('!!extract-react-types-loader!../src/components/LayerManager')} />}
`;
