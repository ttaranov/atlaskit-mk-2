// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  ### TEST

  The inline editor is designed to not stand out as an input when it is not
  focused or being interacted with. It is designed to be used as a wrapper
  to control an input component 

  ~~~js
  import InlineEditor, { InlineEdit } from '@atlaskit/inline-edit';
  ~~~

  The stateful inline editor manages the onEditRequested,{' '}
  onCancel, and onConfirm events and exposes{' '}
  onCancel and onConfirm handlers. All other props
  passed to the InlineEditor component are passed directly
  through to the stateless InlineEdit component.

  ${(
    <Example
      Component={require('../examples/00-test').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-test')}
    />
  )}

`;
