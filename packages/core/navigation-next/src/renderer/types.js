// @flow

import type { ComponentType } from 'react';

import { UIState, ViewState } from '../';
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
  navigationUI: UIState,
  navigationViews: ViewState,
};

export type GroupHeadingProps = {
  text: string,
};

type CustomComponents = { [string]: ComponentType<any> };

type SharedGroupTypeProps = {
  customComponents?: CustomComponents,
  id: string,
  items: ViewData,
};

export type GroupProps = SharedGroupTypeProps & {
  hasSeparator: boolean,
  heading?: string,
};

export type SectionProps = SharedGroupTypeProps & {
  nestedGroupKey: string,
  parentId: string | null,
};

export type ItemsRendererProps = {
  customComponents?: CustomComponents,
  items: ViewData,
};
