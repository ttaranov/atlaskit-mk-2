// @flow
import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  The spotlight component is used typically during onboarding to highlight elements
  of the UI to the user in a modal dialog.

  ## Example
  ${(
    <Example
      Component={require('../examples/1-spotlight-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/1-spotlight-basic')}
    />
  )}

`;
