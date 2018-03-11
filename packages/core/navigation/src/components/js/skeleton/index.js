// @flow
import React, { Component, type ComponentType } from 'react';

import SkeletonNavigationOuter from './styled/SkeletonNavigationOuter';
import SkeletonNavigationInner from './styled/SkeletonNavigationInner';

import SkeletonGlobalNavigation from './SkeletonGlobalNavigation';
import SkeletonContainerNavigation from './SkeletonContainerNavigation';
import SkeletonDefaultContainerHeader from './SkeletonDefaultContainerHeader';
import { HiddenWhenCollapsed } from './ToggleWhenCollapsed';

import type { Provided } from '../../../theme/types';
import { defaultContainerTheme, defaultGlobalTheme } from '../../../theme/util';

export type ContainerHeaderProps = {
  isCollapsed: boolean,
};

export type Props = {
  isCollapsed: boolean,
  globalTheme?: Provided,
  containerTheme?: Provided,
  containerHeaderComponent: ComponentType<ContainerHeaderProps>,
};

export default class SkeletonNavigation extends Component<Props> {
  static defaultProps = {
    isCollapsed: false,
    containerHeaderComponent: SkeletonDefaultContainerHeader,
  };

  render() {
    const {
      isCollapsed,
      globalTheme,
      containerTheme,
      containerHeaderComponent,
    } = this.props;

    return (
      <SkeletonNavigationOuter isCollapsed={isCollapsed}>
        <SkeletonNavigationInner>
          <HiddenWhenCollapsed isCollapsed={isCollapsed}>
            <SkeletonGlobalNavigation theme={defaultGlobalTheme(globalTheme)} />
          </HiddenWhenCollapsed>
          <SkeletonContainerNavigation
            theme={defaultContainerTheme(containerTheme)}
            isCollapsed={isCollapsed}
            containerHeaderComponent={containerHeaderComponent}
          />
        </SkeletonNavigationInner>
      </SkeletonNavigationOuter>
    );
  }
}
