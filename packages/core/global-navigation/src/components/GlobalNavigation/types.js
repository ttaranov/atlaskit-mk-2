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

export type GlobalNavigationProps = {
  productIcon?: ComponentType<*>,
  onProductClick?: () => void,
  productTooltip?: string,

  onCreateClick?: () => void,
  createTooltip?: string,

  onYourWorkClick?: () => void,
  yourWorkTooltip?: string,

  onSearchClick?: () => void,
  searchTooltip?: string,

  appSwitcherComponent?: ComponentType<*>, // AppSwitcher component

  helpTooltip?: string,
  helpItems?: ComponentType<*>, // GlobalNavigation will render DropdownItemGroup with the correct trigger

  profileTooltip?: string,
  profileItems?: ComponentType<*>, // GlobalNavigation will render DropdownItemGroup with the correct trigger
  profileIconUrl?: string,
  loginHref?: string, // Login url to redirect anonymous users to login page.

  onPeopleClick?: () => void,
  peopleTooltip?: string,

  onNotificationClick?: () => void,
  notificationCount?: number,
  notificationTooltip?: string,
};
