// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  This package exports the \'TreeTable\' component.
  
  The component displays a table with expandable, nested rows that form a tree-like hierarchy.
  It supports asynchronous loading of child rows.
  
  ${(
    <Example
      Component={require('../examples/single-component').default}
      source={require('!!raw-loader!../examples/single-component')}
      title="Basic Usage"
    />
  )}
  
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/TreeTable')}
    />
  )}
`;
