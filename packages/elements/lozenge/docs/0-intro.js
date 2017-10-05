// @flow
/* eslint-disable import/extensions, import/no-webpack-loader-syntax, global-require */
import React from 'react';
import { md, Example } from '@atlaskit/docs';

export default md`
  Use lozenges to highlight an item's status for quick recognition. Use
  subtle lozenges by default and in instances where they may dominate the
  screen, such as in long tables.

  ${<Example
    Component={require('../examples/0-basic').default}
    source={require('!!raw-loader!../examples/0-basic')}
  />}
`;
