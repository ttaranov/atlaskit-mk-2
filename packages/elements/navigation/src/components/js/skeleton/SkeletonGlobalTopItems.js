// @flow
import React from 'react';

import { Icon } from '@atlaskit/skeleton';

import SkeletonNavigationItems from '../../styled/skeleton/SkeletonNavigationItems';
import SkeletonGlobalPrimaryIconOuter from '../../styled/skeleton/SkeletonGlobalPrimaryIconOuter';
import SkeletonGlobalIconOuter from '../../styled/skeleton/SkeletonGlobalIconOuter';
import SkeletonGlobalTopItemsInner from '../../styled/skeleton/SkeletonGlobalTopItemsInner';

const SkeletonGlobalTopItems = () => (
  <SkeletonGlobalTopItemsInner>
    <SkeletonNavigationItems>
      <SkeletonGlobalPrimaryIconOuter>
        <Icon size="xlarge" weight="strong" />
      </SkeletonGlobalPrimaryIconOuter>
      <SkeletonGlobalIconOuter>
        <Icon size="large" />
      </SkeletonGlobalIconOuter>
      <SkeletonGlobalIconOuter>
        <Icon size="large" />
      </SkeletonGlobalIconOuter>
    </SkeletonNavigationItems>
  </SkeletonGlobalTopItemsInner>
);

SkeletonGlobalTopItems.displayName = 'SkeletonGlobalTopItems';
export default SkeletonGlobalTopItems;
