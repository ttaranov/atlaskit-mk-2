// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`

  ${(
    <SectionMessage appearance="warning">
      <p>
        <strong>Note: @atlaskit/tree is currently a developer preview.</strong>
      </p>
      <p>
        Please experiment with and test this package but be aware that the API
        may & probably will change with future releases.
      </p>
    </SectionMessage>
  )}

  Tree component provides a generic way to visualize tree structures.

  ## Features

   - Fully customizable node rendering
   - Capability to collapse and expand subtree
   - Lazy loading of subtrees
   - Reorganization of the tree with drag&drop

  ## Examples

  ${(
    <Example
      Component={require('../examples/5-pure-tree').default}
      title="Basic Drag-n-Drop Tree"
      source={require('!!raw-loader!../examples/5-pure-tree')}
    />
  )}

  ${(
    <Props
      heading=" "
      props={require('!!extract-react-types-loader!../src/components/Tree/')}
    />
  )}
  
`;
