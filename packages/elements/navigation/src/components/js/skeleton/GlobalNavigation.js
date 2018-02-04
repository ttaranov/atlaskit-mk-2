// @flow
import React, { Component } from 'react';
import { WithRootTheme } from '../../../theme/util';
import type { Provided } from '../../../theme/types';

import GlobalTopItems from './GlobalTopItems';
import GlobalBottomItems from './GlobalBottomItems';

import GlobalNavigationInner from '../../styled/skeleton/GlobalNavigationInner';
import NavigationContentOuter from '../../styled/skeleton/NavigationContentOuter';

export type Props = {
  isCollapsed: boolean,
  theme: Provided,
};

export default class GlobalNavigation extends Component<Props> {
  static defaultProps = {
    isCollapsed: false,
  };

  render() {
    return (
      <WithRootTheme
        provided={this.props.theme}
        isCollapsed={this.props.isCollapsed}
      >
        <GlobalNavigationInner>
          <NavigationContentOuter>
            <GlobalTopItems />
            <GlobalBottomItems />
          </NavigationContentOuter>
        </GlobalNavigationInner>
      </WithRootTheme>
    );
  }
}
