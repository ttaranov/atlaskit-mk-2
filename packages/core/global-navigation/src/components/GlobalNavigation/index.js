// @flow

import React, { Component, Fragment } from 'react';
import { LaunchDarkly, FeatureFlag } from 'react-launch-darkly';
import { NavigationSubscriber, GlobalNav } from '@atlaskit/navigation-next';

import Drawer from '../Drawer';
import blankLDConfig from '../../config/blank-ld-config';
import defaultConfig from '../../config/default-config';
import type {
  GlobalNavigationProps,
  WrappedGlobalNavigationProps,
} from './types';

class GlobalNavigation extends Component<WrappedGlobalNavigationProps> {
  static defaultProps = {
    primaryActions: [],
    secondaryActions: [],
    userConfig: {
      key: 'unknown@example.com',
    },
  };

  constructPrimaryItems = ldConfig => {
    const { create, product, search, primaryActions, navigation } = this.props;
    const { create: ldCreate, product: ldProduct, search: ldSearch } = ldConfig;
    console.log(ldConfig);
    const {
      create: defaultCreate,
      product: defaultProduct,
      search: defaultSearch,
    } = defaultConfig(navigation);

    const inbuiltPrimaryItems = [];
    // flow complains if && product is not added to the condition
    if (!ldProduct.isDisabled && product) {
      const { component, ...rest } = product;
      inbuiltPrimaryItems.push({
        ...rest,
        ...defaultProduct,
        ...ldProduct,
        component,
      });
    }

    if (!ldSearch.isDisabled) {
      inbuiltPrimaryItems.push({ ...defaultSearch, ...search, ...ldSearch });
    }

    if (!ldCreate.isDisabled) {
      inbuiltPrimaryItems.push({ ...defaultCreate, ...create, ...ldCreate });
    }

    return [...inbuiltPrimaryItems, ...primaryActions];
  };

  constructSecondaryItems = ldConfig => {
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
      help: ldHelp,
      profile: ldProfile,
      appSwitcher: ldAppSwitcher,
      notification: ldNotification,
      people: ldPeople,
    } = ldConfig;

    const {
      help: defaultHelp,
      profile: defaultProfile,
      appSwitcher: defaultAppSwitcher,
      notification: defaultNotification,
      people: defaultPeople,
    } = defaultConfig(navigation);

    const inbuiltSecondaryItems = [];

    if (!ldNotification.isDisabled) {
      inbuiltSecondaryItems.push({
        ...defaultNotification,
        ...notification,
        ...ldNotification,
      });
    }

    if (!ldPeople.isDisabled) {
      inbuiltSecondaryItems.push({ ...defaultPeople, ...people, ...ldPeople });
    }

    if (!ldAppSwitcher.isDisabled) {
      inbuiltSecondaryItems.push({
        ...defaultAppSwitcher,
        ...appSwitcher,
        ...ldAppSwitcher,
      });
    }

    if (!ldHelp.isDisabled) {
      inbuiltSecondaryItems.push({ ...defaultHelp, ...help, ...ldHelp });
    }

    if (!ldProfile.isDisabled) {
      inbuiltSecondaryItems.push({
        ...defaultProfile,
        ...profile,
        ...ldProfile,
      });
    }

    return [...secondaryActions, ...inbuiltSecondaryItems];
  };

  constructGlobalNav = config => {
    let ldConfig;
    try {
      ldConfig = JSON.parse(config);
    } catch (e) {
      ldConfig = blankLDConfig;
      console.warn('LD config is malformed. Please check.');
    }
    const primaryActions = this.constructPrimaryItems(ldConfig);
    const secondaryActions = this.constructSecondaryItems(ldConfig);

    primaryActions.sort(
      (action1, action2) => action1.position - action2.position,
    );
    secondaryActions.sort(
      (action1, action2) => action1.position - action2.position,
    );

    return (
      <GlobalNav
        primaryItems={primaryActions}
        secondaryItems={secondaryActions}
      />
    );
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
    return (
      <LaunchDarkly
        clientId="5b021c6807a72221591bc73b"
        user={this.props.userConfig}
      >
        <Fragment>
          <FeatureFlag
            flagKey="global-navigation-config"
            renderFeatureCallback={this.constructGlobalNav}
          />
          {this.renderDrawer('create')}
          {this.renderDrawer('search', { width: 'wide' })}
          {this.renderDrawer('notification', { width: 'wide' })}
          {this.renderDrawer('people', { width: 'wide' })}
        </Fragment>
      </LaunchDarkly>
    );
  }
}

export default (props: GlobalNavigationProps) => (
  <NavigationSubscriber>
    {navigation => <GlobalNavigation navigation={navigation} {...props} />}
  </NavigationSubscriber>
);
