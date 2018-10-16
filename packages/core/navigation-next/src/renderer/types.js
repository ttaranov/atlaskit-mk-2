// @flow

import type { ComponentType, Node } from 'react';

import { UIController, ViewController } from '../';
import type { ViewData } from '../../src/view-controller/types';

/**
 * Components
 */
export type ItemProps = {
  after?: ?ComponentType<*>,
  before?: ComponentType<*>,
  href?: string,
  icon?: string,
  id: string,
  goTo?: string,
  text: Node,
};

export type GoToItemProps = {
  ...ItemProps,
  after?: ?ComponentType<*>,
  goTo: string,
  navigationUIController: UIController,
  navigationViewController: ViewController,
  spinnerDelay: number,
};

export type GroupHeadingProps = {
  text: string,
};

export type SectionHeadingProps = {
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
  alwaysShowScrollHint: boolean,
  nestedGroupKey: string,
  parentId: string | null,
  shouldGrow: boolean,
};

export type ItemsRendererProps = {
  customComponents?: CustomComponents,
  items: ViewData,
};
