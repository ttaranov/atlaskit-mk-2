// @flow

import type { ComponentType } from 'react';

// import type { NavigationStateInterface } from '../../../state/types';

import type { GlobalTheme } from '@atlaskit/navigation-next';

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

export type GlobalNavProps = {
  children: Node,
  theme: GlobalTheme,
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

  onAppSwitcherClick?: () => void,
  appSwitcherTooltip?: string,
  appSwitcherItems?: ComponentType<*>, // GlobalNavigation will render DropdownItemGroup with the correct trigger

  onHelpClick?: () => void,
  helpTooltip?: string,
  helpItems?: ComponentType<*>, // GlobalNavigation will render DropdownItemGroup with the correct trigger

  onProfileClick?: () => void,
  profileTooltip?: string,
  profileComponent?: ComponentType<*>, // Dropdown component with an Avatar as the trigger

  onPeopleClick?: () => void,
  peopleTooltip?: string,

  onNotificationClick?: () => void,
  notificationCount?: number,
  notificationTooltip?: string,
};
