// @flow
import React from 'react';

import { Icon } from '@atlaskit/skeleton';

import SkeletonNavigationItems from '../../styled/skeleton/SkeletonNavigationItems';
import SkeletonGlobalIconOuter from '../../styled/skeleton/SkeletonGlobalIconOuter';

const SkeletonGlobalBottomItems = () => (
  <SkeletonNavigationItems>
    <SkeletonGlobalIconOuter>
      <Icon size="medium" />
    </SkeletonGlobalIconOuter>
    <SkeletonGlobalIconOuter>
      <Icon size="large" weight="strong" />
    </SkeletonGlobalIconOuter>
  </SkeletonNavigationItems>
);

SkeletonGlobalBottomItems.displayName = 'SkeletonGlobalBottomItems';
export default SkeletonGlobalBottomItems;
