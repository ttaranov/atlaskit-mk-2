// @flow

import type { ComponentType, Node } from 'react';

import type { Theme } from '../../theme/types';

export type SectionTitleProps = {
  after?: ComponentType<*>,
  children: Node,
  theme: Theme,
};
