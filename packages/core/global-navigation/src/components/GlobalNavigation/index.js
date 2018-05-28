// @flow

import React, { Component, Fragment } from 'react';
import { NavigationSubscriber, GlobalNav } from '@atlaskit/navigation-next';

import defaultConfig from '../../config/default-config';
import Drawer from '../Drawer';
import type {
  GlobalNavigationProps,
  WrappedGlobalNavigationProps,
} from './types';

class GlobalNavigation extends Component<WrappedGlobalNavigationProps> {
  static defaultProps = {
    primaryActions: [],
    secondaryActions: [],
  };

  constructPrimaryItems = () => {
    const { create, product, search, primaryActions, navigation } = this.props;
    const {
      product: defaultProduct,
      create: defaultCreate,
      search: defaultSearch,
    } = defaultConfig(navigation);

    const inbuiltPrimaryItems = [];

    if (product) {
      const { component, ...rest } = product;
      inbuiltPrimaryItems.push({
        ...rest,
        ...defaultProduct,
        component,
      });
    }

    if (search) {
      inbuiltPrimaryItems.push({ ...defaultSearch, ...search });
    }

    if (create) {
      inbuiltPrimaryItems.push({ ...defaultCreate, ...create });
    }

    return [...inbuiltPrimaryItems, ...primaryActions];
  };

  constructSecondaryItems = () => {
    const {
      secondaryActions,
      navigation,
      help,
      profile,
      appSwitcher,
      notification,
      people,
    } = this.props;
    const {
      help: defaultHelp,
      profile: defaultProfile,
      appSwitcher: defaultAppSwitcher,
      notification: defaultNotification,
      people: defaultPeople,
    } = defaultConfig(navigation);
    const inbuiltSecondaryItems = [];

    if (notification) {
      inbuiltSecondaryItems.push({ ...defaultNotification, ...notification });
    }

    if (people) {
      inbuiltSecondaryItems.push({ ...defaultPeople, ...people });
    }

    if (appSwitcher) {
      inbuiltSecondaryItems.push({ ...defaultAppSwitcher, ...appSwitcher });
    }

    if (help) {
      inbuiltSecondaryItems.push({ ...defaultHelp, ...help });
    }

    if (profile) {
      inbuiltSecondaryItems.push({ ...defaultProfile, ...profile });
    }

    return [...secondaryActions, ...inbuiltSecondaryItems];
  };

  renderDrawer = (
    drawerKey: 'create' | 'search' | 'notification' | 'people',
    drawerProps,
  ) => {
    const { navigation } = this.props;
    const { activeDrawer } = navigation.state;
    const action = this.props[drawerKey];

    if (!action || !action.drawer) {
      return null;
    }

    const DrawerContent = action.drawer.content;

    return (
      <Drawer
        isOpen={activeDrawer === drawerKey}
        onClose={
          (action.drawer && action.drawer.onClose) ||
          navigation.closeActiveDrawer
        }
        {...drawerProps}
      >
        <DrawerContent closeDrawer={navigation.closeActiveDrawer} />
      </Drawer>
    );
  };

  render() {
    const primaryItems = this.constructPrimaryItems();
    const secondaryItems = this.constructSecondaryItems();

    return (
      <Fragment>
        <GlobalNav
          primaryItems={primaryItems}
          secondaryItems={secondaryItems}
        />
        {this.renderDrawer('create')}
        {this.renderDrawer('search', { width: 'wide' })}
        {this.renderDrawer('notification', { width: 'wide' })}
        {this.renderDrawer('people', { width: 'wide' })}
      </Fragment>
    );
  }
}

export default (props: GlobalNavigationProps) => (
  <NavigationSubscriber>
    {navigation => <GlobalNavigation navigation={navigation} {...props} />}
  </NavigationSubscriber>
);
