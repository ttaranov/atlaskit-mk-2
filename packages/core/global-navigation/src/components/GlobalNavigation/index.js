// @flow

import React, { Component, Fragment } from 'react';
import { LaunchDarkly, FeatureFlag } from 'react-launch-darkly';
import SearchIcon from '@atlaskit/icon/glyph/search';
import CreateIcon from '@atlaskit/icon/glyph/add';
import Avatar from '@atlaskit/avatar';
import QuestionIcon from '@atlaskit/icon/glyph/question';
import MenuIcon from '@atlaskit/icon/glyph/menu';
import NotificationIcon from '@atlaskit/icon/glyph/notification';
import PeopleIcon from '@atlaskit/icon/glyph/people';
import { NavigationSubscriber, GlobalNav } from '@atlaskit/navigation-next';

import Drawer from '../Drawer';
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
  };

  constructPrimaryItems = ldConfig => {
    const { create, product, search, primaryActions, navigation } = this.props;
    const {
      create: ldCreate = { position: null },
      product: ldProduct = { position: null },
      search: ldSearch = { position: null },
    } = ldConfig;

    const inbuiltPrimaryItems = [];

    if (product) {
      const { component, ...rest } = product;
      inbuiltPrimaryItems.push({
        ...rest,
        position: 0,
        component: component || getProductPrimaryItemComponent(navigation),
        ...ldProduct,
      });
    }

    if (search) {
      const defaultSearch = {
        icon: SearchIcon,
        label: 'Search',
        onClick: navigation.openSearchDrawer,
        position: 1,
        tooltip: 'Search',
      };
      inbuiltPrimaryItems.push({ ...defaultSearch, ...search, ...ldSearch });
    }

    if (create) {
      const defaultCreate = {
        icon: CreateIcon,
        label: 'Create',
        onClick: navigation.openCreateDrawer,
        position: 2,
        tooltip: 'Create',
      };
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
      help: ldHelp = { position: null },
      profile: ldProfile = { position: null },
      appSwitcher: ldAppSwitcher = { position: null },
      notification: ldNotification = { position: null },
      people: ldPeople = { position: null },
    } = ldConfig;

    const inbuiltSecondaryItems = [];

    if (notification) {
      const defaultNotifications = {
        icon: NotificationIcon,
        label: 'Notifications',
        onClick: navigation.openNotificationDrawer,
        tooltip: 'Notifications',
        position: 3,
      };
      inbuiltSecondaryItems.push({
        ...defaultNotifications,
        ...notification,
        ...ldNotification,
      });
    }

    if (people) {
      const defaultPeople = {
        icon: PeopleIcon,
        label: 'People directory',
        onClick: navigation.openPeopleDrawer,
        tooltip: 'People directory',
        position: 4,
      };
      inbuiltSecondaryItems.push({ ...defaultPeople, ...people, ...ldPeople });
    }

    if (appSwitcher) {
      const defaultAppSwitcher = {
        icon: MenuIcon,
        label: 'App Switcher',
        tooltip: 'App Switcher',
        position: 5,
      };
      inbuiltSecondaryItems.push({
        ...defaultAppSwitcher,
        ...appSwitcher,
        ...ldAppSwitcher,
      });
    }

    if (help) {
      const defaultHelp = {
        icon: QuestionIcon,
        label: 'Help',
        tooltip: 'Help',
        position: 6,
      };
      inbuiltSecondaryItems.push({ ...defaultHelp, ...help, ...ldHelp });
    }

    if (profile) {
      const defaultUser = {
        icon: () => (
          <Avatar
            borderColor="transparent"
            isActive={false}
            isHover={false}
            size="small"
          />
        ),
        label: 'Your profile and Settings',
        tooltip: 'Your profile and Settings',
        position: 7,
      };
      inbuiltSecondaryItems.push({ ...defaultUser, ...profile, ...ldProfile });
    }

    return [...secondaryActions, ...inbuiltSecondaryItems];
  };

  constructGlobalNav = ldConfig => {
    const primaryActions = this.constructPrimaryItems(JSON.parse(ldConfig));
    const secondaryActions = this.constructSecondaryItems(JSON.parse(ldConfig));

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
    const user = {
      firstName: 'Bob',
      lastName: 'Loblaw',
      key: 'bob@example.com',
      custom: {
        groups: 'beta_testers',
      },
    };
    return (
      <LaunchDarkly clientId="5b021c6807a72221591bc73b" user={user}>
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
