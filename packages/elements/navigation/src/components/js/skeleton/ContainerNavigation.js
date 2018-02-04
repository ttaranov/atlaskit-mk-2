// @flow
import React, { Component, type ComponentType } from 'react';
import { WithRootTheme } from '../../../theme/util';
import type { Provided } from '../../../theme/types';

import GlobalTopItems from './GlobalTopItems';
import GlobalBottomItems from './GlobalBottomItems';
import ContainerItems from './ContainerItems';
import { ShownWhenCollapsed } from './ToggleWhenCollapsed';

import ContainerNavigationInner from '../../styled/skeleton/ContainerNavigationInner';
import NavigationContentOuter from '../../styled/skeleton/NavigationContentOuter';
import ContainerHeaderWrapper from '../../styled/skeleton/ContainerHeaderWrapper';

import type { ContainerHeaderProps } from './';

export type Props = {
  isCollapsed: boolean,
  theme: Provided,
  containerHeaderComponent: ComponentType<ContainerHeaderProps>,
};

export default class Navigation extends Component<Props> {
  static defaultProps = {
    isCollapsed: false,
  };

  render() {
    const ContainerHeaderComponent = this.props.containerHeaderComponent;
    const { theme, isCollapsed } = this.props;
    return (
      <WithRootTheme provided={theme} isCollapsed={isCollapsed}>
        <ContainerNavigationInner isCollapsed={isCollapsed}>
          <NavigationContentOuter>
            <div>
              <ShownWhenCollapsed isCollapsed={isCollapsed}>
                <GlobalTopItems />
              </ShownWhenCollapsed>
              <ContainerHeaderWrapper>
                <ContainerHeaderComponent isCollapsed={isCollapsed} />
              </ContainerHeaderWrapper>
              <ContainerItems isCollapsed={isCollapsed} />
            </div>
            <ShownWhenCollapsed isCollapsed={isCollapsed}>
              <GlobalBottomItems />
            </ShownWhenCollapsed>
          </NavigationContentOuter>
        </ContainerNavigationInner>
      </WithRootTheme>
    );
  }
}
