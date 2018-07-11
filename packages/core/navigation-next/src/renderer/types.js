// @flow

import type { ComponentType } from 'react';

import type { ViewData } from '../../src/view-state/types';

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

export type HeadingProps = {
  text: string,
};

type CustomComponents = { [string]: ComponentType<any> };

type SharedGroupTypeProps = {
  customComponents?: CustomComponents,
  id: string,
  isRootLevel?: boolean,
  items: ViewData,
};

export type GroupProps = SharedGroupTypeProps & {
  hasSeparator: boolean,
  title?: string,
};

export type NestedProps = SharedGroupTypeProps & {
  nestedGroupKey: string,
  parentId: string | null,
};

export type ItemsRendererProps = {
  customComponents?: CustomComponents,
  items: ViewData,
};
