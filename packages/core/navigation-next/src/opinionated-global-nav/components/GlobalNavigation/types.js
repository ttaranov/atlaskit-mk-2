// @flow

import type { ComponentType } from 'react';

import type { ItemDataShape } from '../../../components/GlobalNav/types';
import type { NavigationStateInterface } from '../../../state/types';

export type DrawerContentProps = { closeDrawer: () => void };

type GlobalNavigationItemOptions = {
  drawer?: {
    content: ComponentType<DrawerContentProps>,
    onClose?: () => void,
  },
  href?: string,
  label?: string,
  onClick?: (() => void) | false,
  tooltip?: string,
};

export type GlobalNavigationProps = {
  primaryItems?: Array<ItemDataShape>,
  secondaryItems?: Array<ItemDataShape>,
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
  primaryItems: Array<ItemDataShape>,
  secondaryItems: Array<ItemDataShape>,
};
