// @flow

import React, { Fragment, Component } from 'react';
import Drawer from '@atlaskit/drawer';
import type { GlobalDrawerProps, GlobalDrawerState, DrawerName } from './types';
import ViewTracker from '../ViewTracker';

const noop = () => {};

const analyticsNameMap = {
  search: 'quickSearchDrawer',
  notification: 'notificationsDrawer',
  create: 'createDrawer',
  starred: 'starDrawer',
};

interface GlobalDrawersInterface {
  [key: string]: boolean; // Need an indexer property to appease flow for is${capitalisedDrawerName}Controlled
  isSearchDrawerControlled?: boolean;
  isNotificationDrawerControlled?: boolean;
  isStarredDrawerControlled?: boolean;
}

// $FlowFixMe Flow has a bug with indexer properties in interfaces. https://github.com/facebook/flow/issues/6321
export default class GlobalDrawers
  extends Component<GlobalDrawerProps, GlobalDrawerState>
  implements GlobalDrawersInterface {
  drawers: DrawerName[] = ['search', 'notification', 'starred', 'create'];
  constructor(props: GlobalDrawerProps) {
    super(props);

    this.state = {
      isCreateDrawerOpen: false,
      isSearchDrawerOpen: false,
      isNotificationDrawerOpen: false,
      isStarredDrawerOpen: false,
    };

    this.drawers.forEach((drawer: DrawerName) => {
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
        return;
      }
      // If a drawer doesn't have an onClick handler, mark it as a controlled drawer.
      this[`is${capitalisedDrawerName}Controlled`] = true;

      if (
        props[`${drawer}DrawerContents`] &&
        !props[`is${capitalisedDrawerName}Close`]
      ) {
        /* eslint-disable no-console */
        console.warn(`You have provided an onClick handler for ${drawer}, but no close handler for the drawer.
        Please pass is${capitalisedDrawerName}Close prop to handle closing of the ${drawer} drawer.`);
        /* eslint-enable */
      }

      // Set it's initial state using a prop with the same name.
      this.state[`is${capitalisedDrawerName}Open`] =
        props[`is${capitalisedDrawerName}Open`];
    });
  }

  componentDidUpdate(prevProps: GlobalNavigationProps) {
    this.drawers.forEach(drawer => {
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

  closeDrawer = (drawerName: DrawerName) => () => {
    const capitalisedDrawerName = this.getCapitalisedDrawerName(drawerName);
    const onCloseCallback =
      typeof this.props[`on${capitalisedDrawerName}Close`] === 'function'
        ? this.props[`on${capitalisedDrawerName}Close`]
        : noop;

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

  render() {
    return (
      <Fragment>
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
              <ViewTracker name={analyticsNameMap[drawer]} />
              <DrawerContents />
            </Drawer>
          );
        })}
      </Fragment>
    );
  }
}
