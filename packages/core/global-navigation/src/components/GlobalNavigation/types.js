// @flow

import type { ComponentType } from 'react';
import type { GlobalDrawerProps } from '../GlobalDrawer/types';

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
  productIcon?: ComponentType<{}>,
  onProductClick?: () => void,
  productTooltip?: string,
  productHref?: string,

  onCreateClick?: ?() => void,
  createTooltip?: string,

  onStarredClick?: ?() => void,
  starredTooltip?: string,

  onSearchClick?: ?() => void,
  searchTooltip?: string,

  appSwitcherComponent?: ComponentType<*>, // AppSwitcher component
  appSwitcherTooltip?: string,

  helpTooltip?: string,
  helpItems?: ComponentType<{}>, // GlobalNavigation will render DropdownItemGroup with the correct trigger

  profileTooltip?: string,
  profileItems?: ComponentType<{}>, // GlobalNavigation will render DropdownItemGroup with the correct trigger
  profileIconUrl?: string,
  loginHref?: string, // Login url to redirect anonymous users to login page.

  onNotificationClick?: ?() => void,
  notificationCount?: number,
  notificationTooltip?: string,
} & GlobalDrawerProps;
