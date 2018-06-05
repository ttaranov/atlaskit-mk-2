// @flow

import type { ComponentType } from 'react';

import type { ViewItem } from '../../src/api/types';

/**
 * Components
 */
export type ItemProps = {
  after?: ComponentType<*>,
  before?: ComponentType<*>,
  href?: string,
  icon?: string,
  id: string,
  goTo?: string,
};

export type GoToItemProps = {
  ...ItemProps,
  after?: ?ComponentType<*>,
  goTo: string,
};

export type TitleProps = {
  text: string,
};

type CustomComponents = { [string]: ComponentType<any> };

type SharedGroupTypeProps = {
  customComponents?: CustomComponents,
  id: string,
  isRootLevel?: boolean,
  items: ViewItem[],
};

export type GroupProps = SharedGroupTypeProps & {
  hasSeparator: boolean,
};

export type NestedProps = SharedGroupTypeProps & {
  nestedGroupKey: string,
  parentId: string | null,
};

export type ItemsRendererProps = {
  customComponents?: CustomComponents,
  items: ViewItem[],
  selectedItemId?: string | null,
};
