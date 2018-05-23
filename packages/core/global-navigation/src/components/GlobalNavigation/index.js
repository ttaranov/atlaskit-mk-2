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

// By default we will render a button which toggles the peek behaviour. The
// consumer can opt out of this by passing their own handler or `false` to the
// onClick prop, or by passing a href (which will render an <a>).
// They also opt out of the peek behaviour if they pass in a component to
// the primary item (where getProductPrimaryItemComponent is called)
const getProductPrimaryItemComponent = navigation => ({
  className,
  children,
  href,
  onClick,
  target,
}: *) =>
  href ? (
    <a
      className={className}
      href={href}
      onClick={onClick || null}
      target={target}
    >
      {children}
    </a>
  ) : (
    <button
      className={className}
      onClick={
        typeof onClick !== 'undefined' ? onClick || null : navigation.togglePeek
      }
      onMouseEnter={navigation.hint}
      onMouseLeave={navigation.unHint}
    >
      {children}
    </button>
  );

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
    const {
      create: defaultCreate,
      product: defaultProduct,
      search: defaultSearch,
    } = defaultConfig(navigation);

    const inbuiltPrimaryItems = [];

    if (!defaultProduct.isDisabled) {
      const { component, ...rest } = product;
      inbuiltPrimaryItems.push({
        ...rest,
        ...defaultProduct,
        component: component || getProductPrimaryItemComponent(navigation),
        ...ldProduct,
      });
    }

    if (!defaultSearch.isDisabled) {
      inbuiltPrimaryItems.push({ ...defaultSearch, ...search, ...ldSearch });
    }

    if (!defaultCreate.isDisabled) {
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

    if (!defaultNotification.isDisabled) {
      inbuiltSecondaryItems.push({
        ...defaultNotification,
        ...notification,
        ...ldNotification,
      });
    }

    if (!defaultPeople.isDisabled) {
      inbuiltSecondaryItems.push({ ...defaultPeople, ...people, ...ldPeople });
    }

    if (!defaultAppSwitcher.isDisabled) {
      inbuiltSecondaryItems.push({
        ...defaultAppSwitcher,
        ...appSwitcher,
        ...ldAppSwitcher,
      });
    }

    if (!defaultHelp.isDisabled) {
      inbuiltSecondaryItems.push({ ...defaultHelp, ...help, ...ldHelp });
    }

    if (!defaultProfile.isDisabled) {
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
    console.log(this.props.userConfig);
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
