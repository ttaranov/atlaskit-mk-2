// @flow

import React, { Component, Fragment } from 'react';
import { NavigationSubscriber, GlobalNav } from '@atlaskit/navigation-next';

import generateDefaultConfig from '../../config/default-config';
import generateProductConfig from '../../config/product-config';
import type { GlobalNavigationProps } from './types';

class GlobalNavigation extends Component<GlobalNavigationProps> {
  static defaultProps = {};

  constructNavItems = () => {
    const config = generateProductConfig(this.props);
    const defaultConfig = generateDefaultConfig();

    const navItems = Object.keys(config).map(item => ({
      ...(config[item]
        ? {
            ...defaultConfig[item],
            ...config[item],
          }
        : null),
    }));

    return {
      primaryItems: navItems
        .filter(item => item.section === 'primary')
        .sort((item1, item2) => item1.rank - item2.rank),
      secondaryItems: navItems
        .filter(item => item.section === 'secondary')
        .sort((item1, item2) => item1.rank - item2.rank),
    };
  };

  render() {
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

export default (props: GlobalNavigationProps) => (
  <NavigationSubscriber>
    {navigation => <GlobalNavigation navigation={navigation} {...props} />}
  </NavigationSubscriber>
);
