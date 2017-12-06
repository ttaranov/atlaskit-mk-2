// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  The layer manager is used to render React DOM into a new context (aka "Portal").
  This can be used to implement various UI components such as modals.

  ${(
    <Example
      Component={require('../examples/BasicExample').default}
      source={require('!!raw-loader!../examples/BasicExample')}
      title="Basic example"
    />
  )}

  ${(
    <Example
      Component={require('../examples/ComplexExample').default}
      source={require('!!raw-loader!../examples/ComplexExample')}
      title="Complex example"
    />
  )}

  ${<Props props={require('!!extract-react-types-loader!../src/PageHeader')} />}
`;
