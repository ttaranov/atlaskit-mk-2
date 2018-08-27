// @flow

import React, { Component, Fragment } from 'react';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { GlobalNav } from '@atlaskit/navigation-next';
import Drawer from '@atlaskit/drawer';
import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';
import generateDefaultConfig from '../../config/default-config';
import generateProductConfig from '../../config/product-config';
import generatePlatformIntegration from '../../platform-integration';
import ViewTracker from '../ViewTracker';

import type { GlobalNavItemData, NavItem } from '../../config/types';
import type { GlobalNavigationProps } from './types';

// TODO: Figure out a way to appease flow without this function.
const mapToGlobalNavItem: NavItem => GlobalNavItemData = ({
  id,
  icon,
  label,
  onClick,
  tooltip,
  component,
  badge,
  href,
  size,
}) => ({
  id,
  icon,
  label,
  onClick,
  tooltip,
  component,
  badge,
  href,
  size,
});

const noop = () => {};

const analyticsNameMap = {
  search: 'quickSearchDrawer',
  notification: 'notificationsDrawer',
  create: 'createDrawer',
  starred: 'starDrawer',
};

type GlobalNavigationState = {
  [any]: boolean, // Need an indexer property to appease flow for is${capitalisedDrawerName}Open
  isSearchDrawerOpen: boolean,
  isNotificationDrawerOpen: boolean,
  isStarredDrawerOpen: boolean,
};

export default class GlobalNavigation extends Component<
  GlobalNavigationProps,
  GlobalNavigationState,
> {
  constructNavItems = () => {
    const defaultConfig = generateDefaultConfig();
    const productConfig = generateProductConfig(this.props, this.openDrawer);
    const platformIntegration = generatePlatformIntegration(
      this.props,
      this.openDrawer,
    );

    const navItems: NavItem[] = Object.keys(defaultConfig).map(item => ({
      ...(defaultConfig[item]
        ? {
            ...defaultConfig[item],
            ...productConfig[item],
            ...platformIntegration[item],
          }
        : null),
    }));

    return {
      primaryItems: navItems
        .filter(({ section }) => section === 'primary')
        .sort(({ rank: rank1 }, { rank: rank2 }) => rank1 - rank2)
        .map(mapToGlobalNavItem),
      secondaryItems: navItems
        .filter(({ section }) => section === 'secondary')
        .sort(({ rank: rank1 }, { rank: rank2 }) => rank1 - rank2)
        .map(mapToGlobalNavItem),
    };
  };

  generateGlobalDrawerProps = ({
    isCreateDrawerOpen,
    createDrawerContents,
    onCreateDrawerOpen,
    onCreateDrawerClose,

    isSearchDrawerOpen,
    searchDrawerContents,
    onSearchDrawerOpen,
    onSearchDrawerClose,

    isStarredDrawerOpen,
    starredDrawerContents,
    onStarredDrawerOpen,
    onStarredDrawerClose,
  }) => {
    const {
      isNotificationDrawerOpen,
      notificationDrawerContents,
      onNotificationDrawerOpen,
      onNotificationDrawerClose,
    } = notificationDrawerProps();

    return {
      isCreateDrawerOpen,
      createDrawerContents,
      onCreateDrawerOpen,
      onCreateDrawerClose,

      isSearchDrawerOpen,
      searchDrawerContents,
      onSearchDrawerOpen,
      onSearchDrawerClose,

      isNotificationDrawerOpen,
      notificationDrawerContents,
      onNotificationDrawerOpen,
      onNotificationDrawerClose,

      isStarredDrawerOpen,
      starredDrawerContents,
      onStarredDrawerOpen,
      onStarredDrawerClose,
    };
  };

  render() {
    // TODO: Look into memoizing this to avoid memory bloat
    const { primaryItems, secondaryItems } = this.constructNavItems();

    return (
      <NavigationAnalyticsContext
        data={{
          packageName,
          packageVersion,
          componentName: 'globalNavigation',
        }}
      >
        <Fragment>
          <GlobalNav
            primaryItems={primaryItems}
            secondaryItems={secondaryItems}
          />
          <GlobalDrawers {...this.generateGlobalDrawerProps(this.props)} />
        </Fragment>
      </NavigationAnalyticsContext>
    );
  }
}
