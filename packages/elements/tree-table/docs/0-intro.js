// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  This package exports the \'TreeTable\' component.
  
  The component displays a table with expandable, nested rows that form a tree-like hierarchy.
  It supports asynchronous loading of child rows.
  
  ${(
    <Example
      Component={require('../examples/render-prop-async').default}
      source={require('!!raw-loader!../examples/render-prop-async')}
      title="Basic Usage: Table of Contents"
      language="javascript"
    />
  )}
  
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/TreeTable')}
    />
  )}
`;
