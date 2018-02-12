// @flow
import React, { Component, type ComponentType } from 'react';

import SkeletonNavigationOuter from '../../styled/skeleton/SkeletonNavigationOuter';
import SkeletonNavigationInner from '../../styled/skeleton/SkeletonNavigationInner';

import SkeletonGlobalNavigation from './SkeletonGlobalNavigation';
import SkeletonContainerNavigation from './SkeletonContainerNavigation';
import SkeletonDefaultContainerHeader from './SkeletonDefaultContainerHeader';
import { HiddenWhenCollapsed } from './ToggleWhenCollapsed';

import * as presets from '../../../theme/presets';
import type { Provided } from '../../../theme/types';

export type ContainerHeaderProps = {
  isCollapsed: boolean,
};

export type Props = {
  isCollapsed: boolean,
  globalTheme?: Provided,
  containerTheme?: Provided,
  containerHeaderComponent: ComponentType<ContainerHeaderProps>,
};

// NOTE: Dark mode is a user preference that takes precedence over provided themes
function defaultContainerTheme(containerTheme, mode) {
  if (containerTheme && containerTheme.hasDarkmode) {
    return containerTheme;
  }
  if (mode === 'dark') {
    return presets.dark;
  }
  return containerTheme || presets.container;
}
function defaultGlobalTheme(globalTheme, mode) {
  if (globalTheme && globalTheme.hasDarkmode) return globalTheme;
  if (mode === 'dark') {
    return presets.dark;
  }
  return globalTheme || presets.global;
}

export class SkeletonNavigation extends Component<Props> {
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
