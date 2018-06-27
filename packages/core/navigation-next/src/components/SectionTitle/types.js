// @flow

import type { ComponentType, Node } from 'react';

import type { ProductTheme } from '../../theme/types';

export type SectionTitleProps = {
  /** A component to render after the main content of the title. */
  after?: ComponentType<{}>,
  /** Text content of the SectionTitle. */
  children: Node,
};

export type SectionTitlePrimitiveProps = SectionTitleProps & {
  theme: ProductTheme,
};
