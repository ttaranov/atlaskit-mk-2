// @flow
import React from 'react';

import { Skeleton as SkeletonIcon } from '@atlaskit/icon';

import SkeletonNavigationItems from '../../styled/skeleton/SkeletonNavigationItems';
import SkeletonGlobalIconOuter from '../../styled/skeleton/SkeletonGlobalIconOuter';

const SkeletonGlobalBottomItems = () => (
  <SkeletonNavigationItems>
    <SkeletonGlobalIconOuter>
      <SkeletonIcon size="medium" />
    </SkeletonGlobalIconOuter>
    <SkeletonGlobalIconOuter>
      <SkeletonIcon size="large" weight="strong" />
    </SkeletonGlobalIconOuter>
  </SkeletonNavigationItems>
);

SkeletonGlobalBottomItems.displayName = 'SkeletonGlobalBottomItems';
export default SkeletonGlobalBottomItems;
