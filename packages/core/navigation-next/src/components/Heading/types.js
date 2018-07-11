// @flow

import type { ComponentType, Node } from 'react';

import type { ProductTheme } from '../../theme/types';

export type HeadingProps = {
  after?: ComponentType<*>,
  children: Node,
  theme: ProductTheme,
};
