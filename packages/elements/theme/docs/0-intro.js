// @flow
import React from 'react';
import { md, Props } from '@atlaskit/docs';

export default md`
  Theme Docs

  ${<Props props={require('!!extract-react-types-loader!../src/themed')} />}
`;
