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
      Component={require('../examples/0-static-tree').default}
      title="Basic Static Tree"
      source={require('!!raw-loader!../examples/0-static-tree')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Tree')}
    />
  )}
`;
