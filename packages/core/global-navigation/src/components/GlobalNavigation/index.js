// @flow

import React, { Component, Fragment } from 'react';
import { NavigationSubscriber, GlobalNav } from '@atlaskit/navigation-next';

import generateDefaultConfig from '../../config/default-config';
import generateProductConfig from '../../config/product-config';
import type { GlobalNavigationProps } from './types';

class GlobalNavigation extends Component<GlobalNavigationProps> {
  static defaultProps = {};

  constructNavItems = () => {
    const {
      create,
      product,
      search,
      yourWork,
      help,
      profile,
      appSwitcher,
      notification,
      people,
    } = generateProductConfig(this.props);
    const {
      product: defaultProduct,
      create: defaultCreate,
      search: defaultSearch,
      yourWork: defaultYourWork,
      help: defaultHelp,
      profile: defaultProfile,
      appSwitcher: defaultAppSwitcher,
      notification: defaultNotification,
      people: defaultPeople,
    } = generateDefaultConfig();

    const navItems = [];

    if (notification) {
      navItems.push(Object.assign({}, defaultNotification, notification));
    }

    if (people) {
      navItems.push({ ...defaultPeople, ...people });
    }

    if (yourWork) {
      navItems.push({ ...defaultYourWork, ...yourWork });
    }

    if (appSwitcher) {
      navItems.push({ ...defaultAppSwitcher, ...appSwitcher });
    }

    if (help) {
      navItems.push({ ...defaultHelp, ...help });
    }

    if (profile) {
      navItems.push({ ...defaultProfile, ...profile });
    }

    if (product) {
      navItems.push({ ...product, ...defaultProduct });
    }

    if (search) {
      navItems.push({ ...defaultSearch, ...search });
    }

    if (create) {
      navItems.push({ ...defaultCreate, ...create });
    }

    return [
      ...navItems.sort((item1, item2) =>
        item1.position.localeCompare(item2.position),
      ),
    ];
  };

  render() {
    const navItems = this.constructNavItems();

    return (
      <Fragment>
        <GlobalNav
          primaryItems={navItems.filter(item =>
            item.position.startsWith('top'),
          )}
          secondaryItems={navItems.filter(item =>
            item.position.startsWith('bottom'),
          )}
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
