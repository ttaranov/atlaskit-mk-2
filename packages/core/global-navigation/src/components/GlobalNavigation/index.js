// @flow

import React, { Component, Fragment } from 'react';
import { GlobalNav } from '@atlaskit/navigation-next';
import Drawer from '@atlaskit/drawer';

import generateDefaultConfig from '../../config/default-config';
import generateProductConfig from '../../config/product-config';

import type { GlobalNavItemData, NavItem } from '../../config/types';
import type { GlobalNavigationProps, DrawerName } from './types';

// TODO: Figure out a way to appease flow without this function.
const mapToGlobalNavItem: NavItem => GlobalNavItemData = ({
  icon,
  label,
  onClick,
  tooltip,
  component,
  badge,
}) => ({
  icon,
  label,
  onClick,
  tooltip,
  component,
  badge,
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
  drawers: DrawerName[] = ['search', 'notification', 'starred'];
  constructor(props: GlobalNavigationProps) {
    super(props);

    this.state = {
      isSearchDrawerOpen: false,
      isNotificationDrawerOpen: false,
      isStarredDrawerOpen: false,
    };

    this.drawers.forEach((drawer: DrawerName) => {
      const capitalisedDrawerName = this.getCapitalisedDrawerName(drawer);

      // If a drawer has an onClick handler, mark it as a controlled drawer.
      // ie, if onSearchClick prop is present, this.isSearchDrawerControlled is set to true
      // and this.state.isSearchDrawerOpen is controlled by this.props.isSearchDrawerOpen
      // in componentDidUpdate.
      if (
        props[
          `on${capitalisedDrawerName.substr(
            0,
            capitalisedDrawerName.length - 6,
          )}Click`
        ] !== undefined
      ) {
        this[`is${capitalisedDrawerName}Controlled`] = true;
        this.state[`is${capitalisedDrawerName}Open`] =
          props[`is${capitalisedDrawerName}Open`];
        return;
      }

      this[`is${capitalisedDrawerName}Controlled`] = false;
      this.state[`is${capitalisedDrawerName}Open`] = false;
    });
  }

  componentDidUpdate(prevProps: GlobalNavigationProps) {
    this.drawers.forEach(drawer => {
      const capitalisedDrawerName = this.getCapitalisedDrawerName(drawer);
      if (!this[`is${capitalisedDrawerName}Controlled`]) {
        return;
      }

      if (
        prevProps[`is${capitalisedDrawerName}Open`] !==
        this.props[`is${capitalisedDrawerName}Open`]
      ) {
        // If it's is a controlled drawer, let the props manage the drawer
        this.setState({
          [`is${capitalisedDrawerName}Open`]: this.props[
            `is${capitalisedDrawerName}Open`
          ],
        });
      }
    });
  }

  getCapitalisedDrawerName = (drawerName: DrawerName) => {
    return `${drawerName[0].toUpperCase()}${drawerName.slice(1)}Drawer`;
  };

  openDrawer = (drawerName: DrawerName) => () => {
    const capitalisedDrawerName = this.getCapitalisedDrawerName(drawerName);
    const onOpenCallback =
      typeof this.props[`on${capitalisedDrawerName}Open`] === 'function'
        ? this.props[`on${capitalisedDrawerName}Open`]
        : noop;

    // If it's is a controlled drawer, the props manage the drawer in componentDidUpdate
    if (!this[`is${capitalisedDrawerName}Controlled`]) {
      this.setState(
        {
          [`is${capitalisedDrawerName}Open`]: true,
        },
        onOpenCallback,
      );
    } else {
      onOpenCallback();
    }
  };

  closeDrawer = (drawerName: DrawerName) => () => {
    const capitalisedDrawerName = this.getCapitalisedDrawerName(drawerName);
    const onCloseCallback =
      typeof this.props[`on${capitalisedDrawerName}Close`] === 'function'
        ? this.props[`on${capitalisedDrawerName}Close`]
        : noop;
    // If it's is a controlled drawer, the props manage the drawer in componentDidUpdate
    if (!this[`is${capitalisedDrawerName}Controlled`]) {
      this.setState(
        {
          [`is${capitalisedDrawerName}Open`]: false,
        },
        onCloseCallback,
      );
    } else {
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
      <Fragment>
        <GlobalNav
          primaryItems={primaryItems}
          secondaryItems={secondaryItems}
        />
        {this.drawers.map(drawer => {
          const capitalisedDrawerName = this.getCapitalisedDrawerName(drawer);
          const DrawerContents = this.props[`${drawer}DrawerContents`];

          if (!DrawerContents) {
            return null;
          }

          return (
            <Drawer
              key={drawer}
              isOpen={this.state[`is${capitalisedDrawerName}Open`]}
              onClose={this.closeDrawer(drawer)}
              width="wide"
            >
              <DrawerContents />
            </Drawer>
          );
        })}
      </Fragment>
    );
  }
}
