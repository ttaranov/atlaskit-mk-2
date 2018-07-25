// @flow

import type { ComponentType } from 'react';

export type DrawerContentProps = { closeDrawer: () => void };

export type InitialNavigationStateShape = {
  activeDrawer?: string | null,
  isHinting?: boolean,
  isPeeking?: boolean,
  productNavIsCollapsed?: boolean,
  productNavWidth?: number,
};

export type NavigationStateShape = InitialNavigationStateShape & {
  isResizing?: boolean,
};

export type GlobalNavDrawerProps = {
  isSearchDrawerOpen?: boolean,
  searchDrawerContents?: ComponentType<*>,
  isNotificationDrawerOpen?: boolean,
  notificationDrawerContents?: ComponentType<*>,
  isStarredDrawerOpen?: boolean,
  starredDrawerContents?: ComponentType<*>,
};

export type GlobalNavigationProps = {
  productIcon?: ComponentType<{}>,
  onProductClick?: () => void,
  productTooltip?: string,
  productHref?: string,

  onCreateClick?: () => void,
  createTooltip?: string,

  onStarredDrawerOpen?: () => void,
  onStarredDrawerClose?: () => void,
  onStarredClick?: () => void,
  starredTooltip?: string,

  onSearchDrawerOpen?: () => void,
  onSearchDrawerClose?: () => void,
  onSearchClick?: () => void,
  searchTooltip?: string,

  appSwitcherComponent?: ComponentType<*>, // AppSwitcher component

  helpTooltip?: string,
  helpItems?: ComponentType<{}>, // GlobalNavigation will render DropdownItemGroup with the correct trigger

  profileTooltip?: string,
  profileItems?: ComponentType<{}>, // GlobalNavigation will render DropdownItemGroup with the correct trigger
  profileIconUrl?: string,
  loginHref?: string, // Login url to redirect anonymous users to login page.

  onNotificationDrawerOpen?: () => void,
  onNotificationDrawerClose?: () => void,
  onNotificationClick?: () => void,
  notificationCount?: number,
  notificationTooltip?: string,
} & GlobalNavDrawerProps;

export type DrawerName = 'search' | 'notification' | 'starred';
