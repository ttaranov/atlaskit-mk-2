// @flow

import type { ComponentType } from 'react';

// import type { NavigationStateInterface } from '../../../state/types';

import type {
  GlobalItemProps,
  GlobalTheme,
  NavigationStateInterface,
} from '@atlaskit/navigation-next';

export type DrawerContentProps = { closeDrawer: () => void };

type ItemDataShape = GlobalItemProps & { key?: string };

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
  primaryActions: Array<ItemDataShape>,
  secondaryActions: Array<ItemDataShape>,
  theme: GlobalTheme,
};

type GlobalNavigationItemOptions = {
  drawer?: {
    content: ComponentType<DrawerContentProps>,
    onClose?: () => void,
  },
  href?: string,
  label?: string,
  onClick?: (() => void) | false,
  tooltip?: string,
  component?: ComponentType<*>,
};

export type GlobalNavigationProps = {
  primaryActions?: Array<ItemDataShape>,
  secondaryActions?: Array<ItemDataShape>,
  product: GlobalNavigationItemOptions,
  search?: GlobalNavigationItemOptions,
  create?: GlobalNavigationItemOptions,
  notification?: GlobalNavigationItemOptions,
  people?: GlobalNavigationItemOptions,
  appSwitcher?: GlobalNavigationItemOptions,
  help?: GlobalNavigationItemOptions,
  profile?: GlobalNavigationItemOptions,
};

export type WrappedGlobalNavigationProps = {
  ...GlobalNavigationProps,
  navigation: NavigationStateInterface,
  primaryActions: Array<ItemDataShape>,
  secondaryActions: Array<ItemDataShape>,
};
