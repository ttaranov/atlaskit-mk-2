// @flow

/**
 * NOTE: This GlobalNavigation is the layout primitive, which will be wrapped by
 * the more opinionated @atlaskit/global-navigation component.
 */

import React, { Component } from 'react';

import { withGlobalTheme } from '../../theme';
import GlobalNavigation from './GlobalNavigation';
import type { ConnectedGlobalNavigationProps } from './types';

const GlobalNavigationWithTheme = withGlobalTheme(GlobalNavigation);

export default class ConnectedGlobalNavigation extends Component<
  ConnectedGlobalNavigationProps,
> {
  render() {
    return <GlobalNavigationWithTheme {...this.props} />;
  }
}
