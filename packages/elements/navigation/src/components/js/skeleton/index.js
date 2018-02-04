// @flow
import React, { Component, type ComponentType } from 'react';

import NavigationOuter from '../../styled/skeleton/NavigationOuter';
import NavigationInner from '../../styled/skeleton/NavigationInner';

import GlobalNavigation from './GlobalNavigation';
import ContainerNavigation from './ContainerNavigation';
import DefaultContainerHeader from './DefaultContainerHeader';

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
    containerHeaderComponent: DefaultContainerHeader,
  };

  render() {
    const {
      isCollapsed,
      globalTheme,
      containerTheme,
      containerHeaderComponent,
    } = this.props;

    return (
      <NavigationOuter isCollapsed={isCollapsed}>
        <NavigationInner>
          {!this.props.isCollapsed ? (
            <GlobalNavigation theme={defaultGlobalTheme(globalTheme)} />
          ) : null}
          <ContainerNavigation
            theme={defaultContainerTheme(containerTheme)}
            isCollapsed={isCollapsed}
            containerHeaderComponent={containerHeaderComponent}
          />
        </NavigationInner>
      </NavigationOuter>
    );
  }
}
