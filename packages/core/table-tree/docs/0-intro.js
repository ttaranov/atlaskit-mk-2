// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  This package exports the \`TableTree\` component.

  The component displays a table of expandable, nested rows that form a tree-like hierarchy.
  Child rows can be loaded asynchronously, on expansion.

  Simplest use of the API requires only calling the \`TableTree\` component. More powerful API
  is also exposed, based on multiple subcomponents and the render prop pattern.

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
      props={require('!!extract-react-types-loader!../src/components/TableTree')}
    />
  )}
`;
