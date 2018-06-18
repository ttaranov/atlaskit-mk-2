// @flow
import type { ComponentType } from 'react';

type DefaultItemShape = {
  icon?: ComponentType<*>,
  label: string,
  section: 'primary' | 'secondary',
  rank: number,
  tooltip: string,
};

type ItemShape = {
  tooltip?: string,
  label?: string,
  onClick: () => void,
  icon?: ComponentType<*>,
};

type DropdownItem = ?{
  tooltip?: string,
  label?: string,
  icon?: ComponentType<*>,
  component?: ComponentType<*>,
  badge?: ComponentType<*>,
  href?: string,
};

export type DefaultConfigShape = {
  product: DefaultItemShape,
  yourWork: DefaultItemShape,
  search: DefaultItemShape,
  create: DefaultItemShape,
  notification: DefaultItemShape,
  people: DefaultItemShape,
  appSwitcher: DefaultItemShape,
  help: DefaultItemShape,
  profile: DefaultItemShape,
};

export type ProductConfigShape = {
  product: ?ItemShape,
  create: ?ItemShape,
  search: ?ItemShape,
  yourWork: ?ItemShape,
  notification: ?ItemShape,
  people: ?ItemShape,
  appSwitcher: ?{
    component: ComponentType<*>,
  },
  help: ?DropdownItem,
  profile: ?DropdownItem,
};

export type NavItem = {
  icon?: ComponentType<*>,
  label?: string,
  onClick?: () => void,
  rank: number,
  section: 'primary' | 'secondary',
  tooltip?: string,
};
