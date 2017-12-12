// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  For use cases that need more fine-grained control, the \`TreeTable\` allows for templating based on the 
  render prop pattern and several exported subcomponents.
  
  The render prop is called whenever a tree row needs to be displayed.
  It receives row's data and should return a React
  component — a row of data cells.

  ${(
    <Example
      Component={require('../examples/render-prop-async').default}
      source={require('!!raw-loader!../examples/render-prop-async')}
      title="Render prop"
    />
  )}
  
  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/TreeTable')}
    />
  )}
`;
