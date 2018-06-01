// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';
import { colors } from '@atlaskit/theme';

const Warning = p => (
  <div
    style={{
      backgroundColor: colors.Y75,
      boxShadow: `-4px 0 0 ${colors.Y200}`,
      marginBottom: '1.4em',
      padding: '1em 1.2em',
    }}
    {...p}
  />
);

export default md`

  ${(
    <Warning>
      <p>
        <strong>Note: @atlaskit/tree is currently a developer preview.</strong>
      </p>
      <p>
        Please experiment with and test this package but be aware that the API
        may & probably will change with future releases.
      </p>
    </Warning>
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
  
`;
