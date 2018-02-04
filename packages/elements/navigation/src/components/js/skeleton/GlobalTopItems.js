// @flow
import React from 'react';

import { Icon } from '@atlaskit/skeleton';

import NavigationItems from '../../styled/skeleton/NavigationItems';
import GlobalPrimaryIconOuter from '../../styled/skeleton/GlobalPrimaryIconOuter';
import GlobalIconOuter from '../../styled/skeleton/GlobalIconOuter';
import GlobalTopItemsInner from '../../styled/skeleton/GlobalTopItemsInner';

export default () => (
  <GlobalTopItemsInner>
    <NavigationItems>
      <GlobalPrimaryIconOuter>
        <Icon size="xlarge" weight="strong" />
      </GlobalPrimaryIconOuter>
      <GlobalIconOuter>
        <Icon size="large" />
      </GlobalIconOuter>
      <GlobalIconOuter>
        <Icon size="large" />
      </GlobalIconOuter>
    </NavigationItems>
  </GlobalTopItemsInner>
);
