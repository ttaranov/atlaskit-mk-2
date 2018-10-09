// @flow

import React, { Component, Fragment } from 'react';
import type { UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
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

type GlobalNavigationState = {
  [any]: boolean, // Need an indexer property to appease flow for is${capitalisedDrawerName}Open
  isSearchDrawerOpen: boolean,
  isNotificationDrawerOpen: boolean,
  isStarredDrawerOpen: boolean,
};

interface Global {
  [key: string]: boolean; // Need an indexer property to appease flow for is${capitalisedDrawerName}Controlled
  isSearchDrawerControlled?: boolean;
  isNotificationDrawerControlled?: boolean;
  isStarredDrawerControlled?: boolean;
}

// $FlowFixMe Flow has a bug with indexer properties in interfaces. https://github.com/facebook/flow/issues/6321
export default class GlobalNavigation
  extends Component<GlobalNavigationProps, GlobalNavigationState>
  implements Global {
  drawers: DrawerName[] = ['search', 'notification', 'starred', 'create'];
  constructor(props: GlobalNavigationProps) {
    super(props);

    this.state = {
      isCreateDrawerOpen: false,
      isSearchDrawerOpen: false,
      isNotificationDrawerOpen: false,
      isStarredDrawerOpen: false,
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
  }

  updateDrawerControlledStatus = (
    drawer: DrawerName,
    props: GlobalNavigationProps,
  ) => {
    const capitalisedDrawerName = this.getCapitalisedDrawerName(drawer);

    if (
      props[
        `on${capitalisedDrawerName.substr(
          0,
          capitalisedDrawerName.length - 6, // Trim the `Drawer` bit from ${drawerType}Drawer
        )}Click`
      ]
    ) {
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
    const onOpenCallback =
      typeof this.props[`on${capitalisedDrawerName}Open`] === 'function'
        ? this.props[`on${capitalisedDrawerName}Open`]
        : noop;

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
    const onCloseCallback =
      typeof this.props[`on${capitalisedDrawerName}Close`] === 'function'
        ? this.props[`on${capitalisedDrawerName}Close`]
        : noop;

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

  constructNavItems = () => {
    const productConfig = generateProductConfig(this.props, this.openDrawer);
    const defaultConfig = generateDefaultConfig();

    const navItems: NavItem[] = Object.keys(productConfig).map(item => ({
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
            const DrawerContents = this.props[`${drawer}DrawerContents`];
            const shouldUnmountOnExit = this.props[
              `should${capitalisedDrawerName}UnmountOnExit`
            ];

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
