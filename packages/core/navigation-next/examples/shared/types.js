// @flow

import type { ComponentType } from 'react';

import type { View } from '../../src/api/types';

/**
 * Components
 */
export type ItemProps = {
  after?: ComponentType<*>,
  before?: ComponentType<*>,
  icon?: string,
  goTo?: string,
};

export type GoToItemProps = {
  ...ItemProps,
  after?: ?ComponentType<*>,
  goTo: string,
};

export type ViewRendererProps = { view: View };
