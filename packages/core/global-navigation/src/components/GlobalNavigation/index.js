// @flow

import React, { Component, Fragment } from 'react';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import { NotificationIndicator } from '@atlaskit/notification-indicator';
import { NotificationLogClient } from '@atlaskit/notification-log-client';
import { GlobalNav } from '@atlaskit/navigation-next';
import Drawer from '@atlaskit/drawer';
import {
  name as packageName,
  version as packageVersion,
} from '../../../package.json';
import generateDefaultConfig from '../../config/default-config';
import generateProductConfig from '../../config/product-config';
import ItemComponent from '../ItemComponent';
import ScreenTracker from '../ScreenTracker';
import { analyticsIdMap, fireDrawerDismissedEvents } from './analytics';
import NotificationDrawerContents from '../../platform-integration';

import type { GlobalNavItemData, NavItem } from '../../config/types';
import type { GlobalNavigationProps, DrawerName } from './types';

// TODO: Figure out a way to appease flow without this function.
const mapToGlobalNavItem: NavItem => GlobalNavItemData = ({
  dropdownItems,
  icon,
  id,
  itemComponent,
  label,
  onClick,
  tooltip,
  component,
  badge,
  href,
  size,
}) => ({
  dropdownItems,
  icon,
  id,
  itemComponent,
  label,
  onClick,
  tooltip,
  component,
  badge,
  href,
  size,
});

const noop = () => {};

const localStorage = typeof window === 'object' ? window.localStorage : {};

type GlobalNavigationState = {
  [any]: boolean, // Need an indexer property to appease flow for is${capitalisedDrawerName}Open
  isSearchDrawerOpen: boolean,
  isNotificationDrawerOpen: boolean,
  isStarredDrawerOpen: boolean,
  notificationCount: number,
  isCreateDrawerOpen: boolean,
  isSearchDrawerOpen: boolean,
  isNotificationDrawerOpen: boolean,
  isStarredDrawerOpen: boolean,
};

interface Global {
  [key: string]: boolean; // Need an indexer property to appease flow for is${capitalisedDrawerName}Controlled
  isSearchDrawerControlled?: boolean;
  isNotificationDrawerControlled?: boolean;
  isStarredDrawerControlled?: boolean;
  isNotificationInbuilt: boolean;
}

// $FlowFixMe Flow has a bug with indexer properties in interfaces. https://github.com/facebook/flow/issues/6321
export default class GlobalNavigation
  extends Component<GlobalNavigationProps, GlobalNavigationState>
  implements Global {
  drawers: DrawerName[] = ['search', 'notification', 'starred', 'create'];
  isNotificationInbuilt = false;

  constructor(props: GlobalNavigationProps) {
    super(props);

    this.state = {
      isCreateDrawerOpen: false,
      isSearchDrawerOpen: false,
      isNotificationDrawerOpen: false,
      isStarredDrawerOpen: false,
      notificationCount: 0,
    };

    this.drawers.forEach((drawer: DrawerName) => {
      this.updateDrawerControlledStatus(drawer, props);

      const capitalisedDrawerName = this.getCapitalisedDrawerName(drawer);

      if (
        props[`${drawer}DrawerContents`] &&
        !props[`on${capitalisedDrawerName}Close`]
      ) {
        /* eslint-disable no-console */
        console.warn(`You have provided an onClick handler for ${drawer}, but no close handler for the drawer.
        Please pass on${capitalisedDrawerName}Close prop to handle closing of the ${drawer} drawer.`);
        /* eslint-enable */
      }

      // Set it's initial state using a prop with the same name.
      this.state[`is${capitalisedDrawerName}Open`] =
        props[`is${capitalisedDrawerName}Open`];
    });

    const {
      cloudId,
      fabricNotificationLogUrl,
      notificationDrawerContents,
    } = this.props;
    this.isNotificationInbuilt = !!(
      !notificationDrawerContents &&
      cloudId &&
      fabricNotificationLogUrl
    );
  }

  componentDidUpdate(prevProps: GlobalNavigationProps) {
    this.drawers.forEach(drawer => {
      this.updateDrawerControlledStatus(drawer, this.props);

      const capitalisedDrawerName = this.getCapitalisedDrawerName(drawer);
      // Do nothing if it's a controlled drawer
      if (this[`is${capitalisedDrawerName}Controlled`]) {
        return;
      }

      if (
        prevProps[`is${capitalisedDrawerName}Open`] !==
        this.props[`is${capitalisedDrawerName}Open`]
      ) {
        // Update the state based on the prop
        this.setState({
          [`is${capitalisedDrawerName}Open`]: this.props[
            `is${capitalisedDrawerName}Open`
          ],
        });
      }
    });

    const {
      cloudId,
      fabricNotificationLogUrl,
      notificationDrawerContents,
    } = this.props;
    this.isNotificationInbuilt = !!(
      !notificationDrawerContents &&
      cloudId &&
      fabricNotificationLogUrl
    );
  }

  onCountUpdating = (
    param: { visibilityChangesSinceTimer: number } = {
      visibilityChangesSinceTimer: 0,
    },
  ) => {
    if (
      !this.state.notificationCount ||
      param.visibilityChangesSinceTimer <= 1
    ) {
      // fetch the notificationCount
      return {};
    }

    // skip fetch, refresh from local storage if newer
    const cachedCount = parseInt(this.getLocalStorageCount(), 10);
    const result = {};
    if (cachedCount && cachedCount !== this.state.notificationCount) {
      result.countOverride = cachedCount;
    } else {
      result.skip = true;
    }
    return result;
  };

  onCountUpdated = (param: { newCount: number } = { newCount: 0 }) => {
    this.updateLocalStorageCount(param.newCount);
    this.setState({
      notificationCount: param.newCount,
    });
  };

  getLocalStorageCount = () => {
    try {
      return localStorage.getItem('notificationBadgeCountCache');
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  updateLocalStorageCount = (newCount: number) => {
    try {
      localStorage.setItem('notificationBadgeCountCache', newCount);
    } catch (e) {
      console.error(e);
    }
  };

  updateDrawerControlledStatus = (
    drawer: DrawerName,
    props: GlobalNavigationProps,
  ) => {
    const capitalisedDrawerName = this.getCapitalisedDrawerName(drawer);

    if (props[`on${capitalisedDrawerName.replace('Drawer', '')}Click`]) {
      this[`is${capitalisedDrawerName}Controlled`] = false;
    } else {
      // If a drawer doesn't have an onClick handler, mark it as a controlled drawer.
      this[`is${capitalisedDrawerName}Controlled`] = true;
    }
  };

  getCapitalisedDrawerName = (drawerName: DrawerName) => {
    return `${drawerName[0].toUpperCase()}${drawerName.slice(1)}Drawer`;
  };

  openDrawer = (drawerName: DrawerName) => () => {
    const capitalisedDrawerName = this.getCapitalisedDrawerName(drawerName);
    let onOpenCallback = noop;

    if (typeof this.props[`on${capitalisedDrawerName}Open`] === 'function') {
      onOpenCallback = this.props[`on${capitalisedDrawerName}Open`];
    }

    if (drawerName === 'notification' && this.isNotificationInbuilt) {
      this.onCountUpdated({ newCount: 0 });
    }

    // Update the state only if it's a controlled drawer.
    // componentDidMount takes care of the uncontrolled drawers
    if (this[`is${capitalisedDrawerName}Controlled`]) {
      this.setState(
        {
          [`is${capitalisedDrawerName}Open`]: true,
        },
        onOpenCallback,
      );
    } else {
      // invoke callback in both cases
      onOpenCallback();
    }
  };

  closeDrawer = (drawerName: DrawerName) => (
    event: SyntheticMouseEvent<*> | SyntheticKeyboardEvent<*>,
    analyticsEvent: UIAnalyticsEvent,
  ) => {
    const capitalisedDrawerName = this.getCapitalisedDrawerName(drawerName);
    let onCloseCallback = noop;

    if (typeof this.props[`on${capitalisedDrawerName}Close`] === 'function') {
      onCloseCallback = this.props[`on${capitalisedDrawerName}Close`];
    }

    fireDrawerDismissedEvents(drawerName, analyticsEvent);

    // Update the state only if it's a controlled drawer.
    // componentDidMount takes care of the uncontrolled drawers
    if (this[`is${capitalisedDrawerName}Controlled`]) {
      this.setState(
        {
          [`is${capitalisedDrawerName}Open`]: false,
        },
        onCloseCallback,
      );
    } else {
      // invoke callback in both cases
      onCloseCallback();
    }
  };

  renderNotificationBadge = () => {
    const { cloudId, fabricNotificationLogUrl } = this.props;
    const refreshRate = this.state.notificationCount ? 180000 : 60000;

    return (
      <NotificationIndicator
        notificationLogProvider={
          new NotificationLogClient(fabricNotificationLogUrl, cloudId)
        }
        refreshRate={refreshRate}
        onCountUpdated={this.onCountUpdated}
        onCountUpdating={this.onCountUpdating}
      />
    );
  };

  renderNotificationDrawerContents = () => {
    const { locale, product } = this.props;

    return <NotificationDrawerContents product={product} locale={locale} />;
  };

  constructNavItems = () => {
    const productConfig = generateProductConfig(
      this.props,
      this.openDrawer,
      this.isNotificationInbuilt,
    );
    const defaultConfig = generateDefaultConfig();
    const badge = this.renderNotificationBadge;

    const navItems: NavItem[] = Object.keys(productConfig).map(item => ({
      ...(productConfig[item]
        ? {
            ...(item === 'notification' && this.isNotificationInbuilt
              ? { badge }
              : {}),
            ...defaultConfig[item],
            ...productConfig[item],
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
            itemComponent={ItemComponent}
            primaryItems={primaryItems}
            secondaryItems={secondaryItems}
          />
          {this.drawers.map(drawer => {
            const capitalisedDrawerName = this.getCapitalisedDrawerName(drawer);
            const shouldUnmountOnExit = this.props[
              `should${capitalisedDrawerName}UnmountOnExit`
            ];

            const DrawerContents =
              drawer === 'notification' && this.isNotificationInbuilt
                ? this.renderNotificationDrawerContents
                : this.props[`${drawer}DrawerContents`];

            if (!DrawerContents) {
              return null;
            }

            return (
              <Drawer
                key={drawer}
                isOpen={this.state[`is${capitalisedDrawerName}Open`]}
                onClose={this.closeDrawer(drawer)}
                shouldUnmountOnExit={shouldUnmountOnExit}
                width="wide"
              >
                <ScreenTracker
                  name={analyticsIdMap[drawer]}
                  isVisible={this.state[`is${capitalisedDrawerName}Open`]}
                />
                <DrawerContents />
              </Drawer>
            );
          })}
        </Fragment>
      </NavigationAnalyticsContext>
    );
  }
}
