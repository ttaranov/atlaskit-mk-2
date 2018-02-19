// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  Buttons are used as triggers for actions. They are used in forms, toolbars,
  dialog footers and as stand-alone action triggers.

  Button also exports a button-group component to make it easy to display
  multiple buttons together.

  ${(
    <Example
      Component={require('../examples/ButtonAppearances').default}
      title="Types & States"
      source={require('!!raw-loader!../examples/ButtonAppearances')}
    />
  )}
`;
