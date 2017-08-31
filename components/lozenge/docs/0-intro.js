// @flow
import * as React from 'react';
import { md, Example, Props } from '@atlaskit/docs';

export default md`
  Use lozenges to highlight an item's status for quick recognition. Use
  subtle lozenges by default and in instances where they may dominate the
  screen, such as in long tables.

  ${<Example source={require('!!raw-loader!../examples/0-basic')} />}

  ${<Props source={require('!!raw-loader!../src/Lozenge')} />}
`;
