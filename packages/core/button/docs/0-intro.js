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
      packageName="@atlaskit/button"
      Component={require('../examples/ButtonAppearances').default}
      title="Your Appearance Options"
      source={require('!!raw-loader!../examples/ButtonAppearances')}
    />
  )}

  ${(
    <Props
      heading="Button Props"
      props={require('!!extract-react-types-loader!../src/components/Button')}
    />
  )}

### You can also use button groups

  ${(
    <Example
      packageName="@atlaskit/button"
      Component={require('../examples/ButtonGroupExample').default}
      title="Simple Button Group"
      source={require('!!raw-loader!../examples/ButtonGroupExample')}
    />
  )}

  ${(
    <Props
      heading="Button Group Props"
      props={require('!!extract-react-types-loader!../src/components/ButtonGroup')}
    />
  )}
`;
