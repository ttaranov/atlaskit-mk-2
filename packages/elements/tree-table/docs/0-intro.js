// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  This package exports the \'TreeTable\' component.
  
  The component displays a table with expandable rows that form a tree-like hierarchy.

  ${(
    <Example
      Component={require('../examples/single-component').default}
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
