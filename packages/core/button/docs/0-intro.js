// @flow
import React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  Buttons are used as triggers for actions. They are used in forms, toolbars,
  dialog footers and as stand-alone action triggers.

  Button also exports a button-group component to make it easy to display
  multiple buttons together.

  ${(
    <Props
      heading="Button Props"
      props={require('!!extract-react-types-loader!../src/components/Button')}
    />
  )}

### You can also use button groups

  ${(
    <Props
      heading="Button Group Props"
      props={require('!!extract-react-types-loader!../src/components/ButtonGroup')}
    />
  )}
`;
