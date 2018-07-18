// @flow

import type { ComponentType, Node } from 'react';

import type { ProductTheme } from '../../theme/types';

export type GroupHeadingProps = {
  /** A component to render after the main content of the title. */
  after?: ComponentType<*>,
  /** Text content of the GroupHeading. */
  children: Node,
};

export type GroupHeadingPrimitiveProps = GroupHeadingProps & {
  theme: ProductTheme,
};
