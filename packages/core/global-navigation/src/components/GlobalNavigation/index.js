// @flow

import React, { Component, Fragment } from 'react';
import { GlobalNav } from '@atlaskit/navigation-next';

import generateDefaultConfig from '../../config/default-config';
import generateProductConfig from '../../config/product-config';

import type { NavItem } from '../../config/types';
import type { GlobalNavigationProps } from './types';

export default class GlobalNavigation extends Component<GlobalNavigationProps> {
  static defaultProps = {};

  constructNavItems = () => {
    const productConfig = generateProductConfig(this.props);
    const defaultConfig = generateDefaultConfig();

    const navItems: Array<NavItem> = Object.keys(productConfig).map(item => ({
      ...(productConfig[item]
        ? {
            ...defaultConfig[item],
            ...productConfig[item],
          }
        : null),
    }));

    return {
      primaryItems: navItems
        .filter(({ section }) => section === 'primary')
        .sort(({ rank: rank1 }, { rank: rank2 }) => rank1 - rank2),
      secondaryItems: navItems
        .filter(({ section }) => section === 'secondary')
        .sort(({ rank: rank1 }, { rank: rank2 }) => rank1 - rank2),
    };
  };

  render() {
    // TODO: Look into memoizing this to avoid memory bloat
    const { primaryItems, secondaryItems } = this.constructNavItems();

    return (
      <Fragment>
        <GlobalNav
          primaryItems={primaryItems}
          secondaryItems={secondaryItems}
        />
      </Fragment>
    );
  }
}
