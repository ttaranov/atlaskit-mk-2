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
  create?: GlobalNavigationItemOptions,
  primaryItems?: Array<ItemDataShape>,
  product: GlobalNavigationItemOptions,
  search?: GlobalNavigationItemOptions,
  secondaryItems?: Array<ItemDataShape>,
};

export type WrappedGlobalNavigationProps = {
  ...GlobalNavigationProps,
  navigation: NavigationStateInterface,
  primaryItems: Array<ItemDataShape>,
  secondaryItems: Array<ItemDataShape>,
};
