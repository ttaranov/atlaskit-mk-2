// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  This package exports a single \`TreeTable\` component.

  ${(
    <Example
      Component={require('../examples/single-component-no-headers').default}
      source={require('!!raw-loader!../examples/single-component-no-headers')}
      title="Basic Usage"
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/TreeTable')}
    />
  )}
`;
