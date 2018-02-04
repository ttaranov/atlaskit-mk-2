// @flow
import React from 'react';

import { Icon } from '@atlaskit/skeleton';

import NavigationItems from '../../styled/skeleton/NavigationItems';
import GlobalIconOuter from '../../styled/skeleton/GlobalIconOuter';

export default () => (
  <NavigationItems>
    <GlobalIconOuter>
      <Icon size="medium" />
    </GlobalIconOuter>
    <GlobalIconOuter>
      <Icon size="large" weight="strong" />
    </GlobalIconOuter>
  </NavigationItems>
);
