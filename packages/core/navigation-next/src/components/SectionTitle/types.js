// @flow

import type { ComponentType, Node } from 'react';

import type { ProductTheme } from '../../theme/types';

export type SectionTitleProps = {
  after?: ComponentType<*>,
  children: Node,
  theme: ProductTheme,
};
