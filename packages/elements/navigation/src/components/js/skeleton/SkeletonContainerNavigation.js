// @flow
import React, { Component, type ComponentType } from 'react';
import { WithRootTheme } from '../../../theme/util';
import type { Provided } from '../../../theme/types';

import SkeletonGlobalTopItems from './SkeletonGlobalTopItems';
import SkeletonGlobalBottomItems from './SkeletonGlobalBottomItems';
import SkeletonContainerItems from './SkeletonContainerItems';
import { ShownWhenCollapsed } from './ToggleWhenCollapsed';

import SkeletonContainerNavigationInner from '../../styled/skeleton/SkeletonContainerNavigationInner';
import SkeletonNavigationContentOuter from '../../styled/skeleton/SkeletonNavigationContentOuter';
import SkeletonContainerHeaderWrapper from '../../styled/skeleton/SkeletonContainerHeaderWrapper';

import type { ContainerHeaderProps } from './';

export type Props = {
  isCollapsed: boolean,
  theme: Provided,
  containerHeaderComponent: ComponentType<ContainerHeaderProps>,
};

export default class SkeletonContainerNavigation extends Component<Props> {
  static defaultProps = {
    isCollapsed: false,
  };

  render() {
    const ContainerHeaderComponent = this.props.containerHeaderComponent;
    const { theme, isCollapsed } = this.props;
    return (
      <WithRootTheme provided={theme} isCollapsed={isCollapsed}>
        <SkeletonContainerNavigationInner isCollapsed={isCollapsed}>
          <SkeletonNavigationContentOuter>
            <div>
              <ShownWhenCollapsed isCollapsed={isCollapsed}>
                <SkeletonGlobalTopItems />
              </ShownWhenCollapsed>
              <SkeletonContainerHeaderWrapper>
                <ContainerHeaderComponent isCollapsed={isCollapsed} />
              </SkeletonContainerHeaderWrapper>
              <SkeletonContainerItems isCollapsed={isCollapsed} />
            </div>
            <ShownWhenCollapsed isCollapsed={isCollapsed}>
              <SkeletonGlobalBottomItems />
            </ShownWhenCollapsed>
          </SkeletonNavigationContentOuter>
        </SkeletonContainerNavigationInner>
      </WithRootTheme>
    );
  }
}
